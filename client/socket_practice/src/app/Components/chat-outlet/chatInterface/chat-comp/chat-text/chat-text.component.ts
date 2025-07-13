import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Messages } from '../../../../../DTO/message.dto';
import { ChromeDataTransactionService } from '../../../../../services/chromeDataTransaction/chrome-data-transaction.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../../delete-confirmation/delete-confirmation.component';

export type deletEmitterType = {
  deleteFor: 'me' | 'everyone',
  messageId: string
}

@Component({
  selector: 'raj-chat-chat-text',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './chat-text.component.html',
  styleUrl: './chat-text.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatTextComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('chatContainer') private ChatContainer!: ElementRef
  @Input() chats: Messages = new Array()
  @Output() deleteMessageEmitter: EventEmitter<deletEmitterType> = new EventEmitter<deletEmitterType>();

  private lastChatLength = 0;

  constructor(
    private dataService: ChromeDataTransactionService,
    private dialog: MatDialog
  ) { }

  public dateNumToDateStr = (date: string): string => new Date(date).toLocaleString();

  ngAfterViewInit(): void {
    this.scrollToBottom()
  }

  ngAfterViewChecked(): void {
    if (this.chats.length !== this.lastChatLength) {
      this.lastChatLength = this.chats.length
      this.scrollToBottom()
    }
  }

  scrollToBottom() {
    try {
      this.ChatContainer.nativeElement.scrollTop = this.ChatContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.error(error)
    }
  }

  isRecieved = (message: Messages[0]) => message.receiver._id === this.dataService.getCookies('user').id

  deleteMessage = (messageId: string, isRecieved: boolean) => {
    this.openDeletePopup(messageId, isRecieved)
  }

  openDeletePopup(messageId: string, isRecieved: boolean) {
    console.log(isRecieved)
    const dialogRef = this.dialog.open(
      DeleteConfirmationComponent, {
      data: {
        dialog: `Are you sure you want to delete this message?${isRecieved ? '' : ` It will be removed only for you.`}`,
        buttonNames: {
          YES: `Delete ${isRecieved ? '' : ' for everyone'}`,
          NO: isRecieved ? "Cancel" : "Delete for me"
        }
      },
      width: '400px'
    })

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          if (isRecieved) {
            if (res === 'YES') {
              this.deleteMessageEmitter.emit({
                messageId: messageId,
                deleteFor: 'me'
              })
            }
          } else {
            this.deleteMessageEmitter.emit({
              messageId: messageId,
              deleteFor: res === 'YES' ? 'everyone' : 'me'
            })
          }
        }
      }, error: (err) => console.error(err)
    })
  }
}
