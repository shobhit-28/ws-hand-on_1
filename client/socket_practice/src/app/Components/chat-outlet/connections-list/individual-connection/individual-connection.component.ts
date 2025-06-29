import { Component, inject, Input } from '@angular/core';
import { UserDetails } from '../../../../DTO/users.dto';
import { CoreJsService } from '../../../../services/coreJs/core-js.service';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../../services/chat/chat.service';

@Component({
  selector: 'raj-chat-individual-connection',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './individual-connection.component.html',
  styleUrl: './individual-connection.component.css'
})
export class IndividualConnectionComponent {
  constructor(
    private coreJsService: CoreJsService,
    private chatService: ChatService
  ) {}

  @Input() user!: UserDetails
  @Input() selectedUser: boolean = false

  add2Str = (str1: string, str2: string) => `${str1} ${str2}`

  returnTruncatedStr = (str: string, maxLen: number) => this.coreJsService.truncateText(str, maxLen)

  getSelectedUser = (): UserDetails => this.chatService.getSelectedChat()
}
