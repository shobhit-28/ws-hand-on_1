export type ChatArr = Array<{ received: boolean, message: string, timestamp: number }>

type User = {
  _id: string
  name: string
  email: string
  profile_pic?: string
  profile_pic_id?: string
}

export type Messages = Array<{
  _id: string
  content: string
  sender: User
  receiver: User
  createdAt: string
}>

export type deletedMessageRecieverType = {
  messageId: string
  userId: string
}
