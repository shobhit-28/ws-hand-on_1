import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Messages } from '../../../../../DTO/message.dto';
import { ChromeDataTransactionService } from '../../../../../services/chromeDataTransaction/chrome-data-transaction.service';

@Component({
  selector: 'raj-chat-chat-text',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './chat-text.component.html',
  styleUrl: './chat-text.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatTextComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('chatContainer') private ChatContainer!: ElementRef
  @Input() chats: Messages = new Array()

  private lastChatLength = 0;

  constructor(
    private dataService: ChromeDataTransactionService,
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
}
