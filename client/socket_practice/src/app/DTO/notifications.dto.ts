import { ChatFriendsList } from "./users.dto"

export type NotificationType = {
  type: 'follow' | 'like' | 'comment',
  content: string,
  isRead: boolean,
  sender: ChatFriendsList,
  postId: string
}
