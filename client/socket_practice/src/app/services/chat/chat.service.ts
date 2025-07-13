import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { defaultChatFriendVal, ChatFriendsList } from '../../DTO/users.dto';
import { ChatArr, chatArr, Messages } from '../../DTO/message.dto';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../notification/notification.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../DTO/commonResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChat: ChatFriendsList = defaultChatFriendVal
  usersList: Array<ChatFriendsList> = [];

  constructor(
    private notificationService: NotificationService,
    private http: HttpClient,
  ) { }

  getAllChattingMates = (): Array<ChatFriendsList> => this.usersList

  getChattableMates = () => {
    this.http.get<ApiResponse<Array<ChatFriendsList>>>(`/rchat/chat/getchatfriendslist`).subscribe({
      next: (res: ApiResponse<Array<ChatFriendsList>>) => {
        this.usersList = res.data
      },
      error: (err) => console.error(err)
    })
  }

  setSelectedChat(user: ChatFriendsList): void {
    this.selectedChat = defaultChatFriendVal;
    setTimeout(() => {
      this.selectedChat = user
    }, 100)
  }

  clearSelection = (): void => {
    this.selectedChat = defaultChatFriendVal
  }

  getSelectedChat = (): ChatFriendsList => this.selectedChat

  getMessagesForUser(userId: string): Observable<Messages> {
    return this.http.get<ApiResponse<Messages>>(`/rchat/chat/getMessages/${userId}`).pipe(
      map((res: ApiResponse<Messages>) => res.data)
    )
  }

  sendMessage(message: string, userId: string): Observable<Messages[0]> {
    return this.http.post<ApiResponse<Messages[0]>>(`/rchat/chat/sendMessage`, {
      receiverId: userId,
      content: message
    }).pipe(
      map(res => res.data)
    )
  }
}
