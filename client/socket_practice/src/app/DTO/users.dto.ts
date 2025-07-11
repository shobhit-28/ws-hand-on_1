export type ChatFriendsList = {
  _id: string;
  name: string;
  email: string;
  profile_pic: string
}

export const defaultChatFriendVal: ChatFriendsList = {
  _id: '',
  name: '',
  email: '',
  profile_pic: ''
}
