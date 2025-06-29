import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDetails } from '../../../DTO/users.dto';
import { IndividualConnectionComponent } from "./individual-connection/individual-connection.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'raj-chat-connections-list',
  standalone: true,
  imports: [
    IndividualConnectionComponent,
    FormsModule
  ],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionsListComponent {
  @Input() usersList!: Array<UserDetails>

  @Output() emitUserId: EventEmitter<UserDetails> = new EventEmitter<UserDetails>()

  connectionFilter: string = ''
  selectedUser: string | null = null

  public filterConnections(users: Array<UserDetails>): Array<UserDetails> {
    if (this.connectionFilter === null || this.connectionFilter === '' || this.connectionFilter === undefined) {
      return users
    } else {
      return users.filter(
        (user) => {
          const filter = this.connectionFilter.toLowerCase()
          return (
            user.username.toLocaleLowerCase().includes(filter) ||
            user.firstName.toLocaleLowerCase().includes(filter) ||
            user.lastName.toLocaleLowerCase().includes(filter)
          )
        }
      )
    }
  }

  public selectUser(user: UserDetails) {
    this.selectedUser = user._id
    this.emitUserId.emit(user)
  }
}
