import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserDetails } from '../../../DTO/users.dto';
import { IndividualConnectionComponent } from "./individual-connection/individual-connection.component";

@Component({
  selector: 'raj-chat-connections-list',
  standalone: true,
  imports: [IndividualConnectionComponent],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsListComponent {
  @Input() usersList!: Array<UserDetails>
}
