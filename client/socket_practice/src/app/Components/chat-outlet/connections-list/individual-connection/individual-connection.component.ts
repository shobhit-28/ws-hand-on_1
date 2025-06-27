import { Component, Input } from '@angular/core';
import { UserDetails } from '../../../../DTO/users.dto';

@Component({
  selector: 'raj-chat-individual-connection',
  standalone: true,
  imports: [],
  templateUrl: './individual-connection.component.html',
  styleUrl: './individual-connection.component.css'
})
export class IndividualConnectionComponent {
  @Input() user!: UserDetails
}
