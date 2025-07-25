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

export type SearchUserList = {
  users: Array<{
    _id: string,
    name: string,
    email: string,
    firstMessageSent: boolean,
    profile_pic?: string,
    matchRank: number
  }>,
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
