import { Injectable } from '@angular/core';
import { defaultUserDetail, UserDetails, usersList } from '../../DTO/users.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat: UserDetails = defaultUserDetail

  constructor() { }

  getAllChattingMates = (): Array<UserDetails> => usersList

  setSelectedChat(user: UserDetails): void {
    this.selectedChat = user
  }

  clearSelection = (): void => {
    this.selectedChat = defaultUserDetail
  }

  getSelectedChat = (): UserDetails => this.selectedChat
}
