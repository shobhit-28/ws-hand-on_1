import { Component, Input } from '@angular/core';
import { UserDetails } from '../../../../DTO/users.dto';
import { CoreJsService } from '../../../../services/coreJs/core-js.service';

@Component({
  selector: 'raj-chat-individual-connection',
  standalone: true,
  imports: [],
  templateUrl: './individual-connection.component.html',
  styleUrl: './individual-connection.component.css'
})
export class IndividualConnectionComponent {
  constructor(
    private coreJsService: CoreJsService
  ) {}

  @Input() user!: UserDetails

  add2Str = (str1: string, str2: string) => `${str1} ${str2}`

  returnTruncatedStr = (str: string, maxLen: number) => this.coreJsService.truncateText(str, maxLen)
}
