import { Post } from "./posts.dto"
import { ChatFriendsList } from "./users.dto"

export type NotificationType = {
  _id: string
  recipientId: ChatFriendsList
  senderId: ChatFriendsList
  type: 'follow' | 'like' | 'comment' | 'new_message' | 'reply'
  postId?: Post
  messageId?: string
  commentId?: string
  replyId?: string
  content?: string
  isRead: boolean
  createdAt: string
}

