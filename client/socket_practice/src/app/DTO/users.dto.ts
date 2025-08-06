import { Post } from "./posts.dto";

export type ChatFriendsList = {
  _id: string;
  name: string;
  email: string;
  profile_pic: string,
  bio?: string
}

export const defaultChatFriendVal: ChatFriendsList = {
  _id: '',
  name: '',
  email: '',
  profile_pic: '',
  bio: ''
}

export type SearchUserList = {
  users: Array<{
    _id: string,
    name: string,
    email: string,
    firstMessageSent: boolean,
    profile_pic?: string,
    matchRank: number,
    relationship: 'mutual' | 'following' | 'follower' | 'none'
  }>,
  total: number,
  page: number,
  limit: number,
  totalPages: number
}

export const defaultSearchedUser: SearchUserList = {
  users: new Array(),
  total: 0,
  page: 0,
  limit: 0,
  totalPages: 0
}

export type ExpandedUser = {
  _id: string,
  name: string,
  email: string,
  profile_pic?: string
}

export type GetFollowerList = Array<{
  _id: string,
  follower: string,
  following: ExpandedUser,
  createdAt: string,
  updatedAt: string,
  __v: number
}>

export type GetFollowingList = Array<{
  _id: string,
  follower: ExpandedUser,
  following: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}>

export type UserProfileLoader = {
  profile_pic: boolean,
  fullPageLoader: boolean
}

export const defaultUserProfileLoaderValue: UserProfileLoader = {
  profile_pic: true,
  fullPageLoader: true
}

export type UserProfileUser = {
  userDetails: ChatFriendsList,
  followers: GetFollowerList,
  following: GetFollowingList,
  status: { isGettingFollowed: boolean, isAlreadyFollowing: boolean },
  posts: Array<Post & { status: { isGettingFollowed: boolean, isAlreadyFollowing: boolean } }>
}

export const defaultUserProfileUser: UserProfileUser = {
  userDetails: defaultChatFriendVal,
  followers: new Array(),
  following: new Array(),
  status: { isGettingFollowed: true, isAlreadyFollowing: true },
  posts: new Array()
}
export type updateProfileApiPayload = {
  name: string,
  email: string,
  bio: string
}
