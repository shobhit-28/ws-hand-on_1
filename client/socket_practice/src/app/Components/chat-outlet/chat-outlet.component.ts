import { Component, Input } from '@angular/core';
import { UserDetails } from '../../DTO/users.dto';
import { ConnectionsListComponent } from "./connections-list/connections-list.component";

@Component({
  selector: 'raj-chat-chat-outlet',
  standalone: true,
  imports: [ConnectionsListComponent],
  templateUrl: './chat-outlet.component.html',
  styleUrl: './chat-outlet.component.css'
})
export class ChatOutletComponent {
  @Input() usersList: Array<UserDetails> = new Array;
}
