import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

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
export class ChatTextComponent implements AfterViewInit {
  @ViewChild('chatContainer') private ChatContainer!: ElementRef

  @Input() chats: Array<{ received: boolean, message: string, timestamp: number }> = new Array()

  public dateNumToDateStr = (date: number): string => new Date(date).toLocaleString()

  ngAfterViewInit(): void {
    try {
      this.ChatContainer.nativeElement.scrollTop = this.ChatContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.error(error)
    }
  }
}
