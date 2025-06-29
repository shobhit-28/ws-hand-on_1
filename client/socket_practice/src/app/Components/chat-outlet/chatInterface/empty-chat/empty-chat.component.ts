import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'raj-chat-empty-chat',
  standalone: true,
  imports: [],
  templateUrl: './empty-chat.component.html',
  styleUrl: './empty-chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyChatComponent {

}
