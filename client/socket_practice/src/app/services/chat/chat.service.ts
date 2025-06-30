import { Injectable } from '@angular/core';
import { defaultUserDetail, UserDetails, usersList } from '../../DTO/users.dto';
import { ChatArr, chatArr } from '../../DTO/message.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat: UserDetails = defaultUserDetail

  constructor() { }

  getAllChattingMates = (): Array<UserDetails> => usersList

  setSelectedChat(user: UserDetails): void {
    this.selectedChat = defaultUserDetail;
    setTimeout(() => {
      this.selectedChat = user
    }, 100)
  }

  clearSelection = (): void => {
    this.selectedChat = defaultUserDetail
  }

  getSelectedChat = (): UserDetails => this.selectedChat

  getMessagesForUser(userId: string): ChatArr {
    return chatArr
  }

  sendMessage(message: string, userId: string) {
    console.log(message, userId)
  }
}
