import { ChatFriendsList } from "./users.dto"


export type commentsType = {
  userId: number,
  text: string,
  createdAt: Date
  replies: Array<commentsType>
}

export type postsType = {
  userId: number,
  imageUrl: string,
  caption: string,
  likedBy: Array<string>,
  comments: Array<commentsType>,
  postedOn: Date
}

type Comment = {
  _id: string,
  postId: string,
  userId: ChatFriendsList,
  text: string,
  createdAt: string,
  replies: Array<Comment>,
  __v: number
}

export type Post = {
  _id: string,
  userId: ChatFriendsList,
  content: string,
  photoFileName: string,
  likes: Array<string>,
  comments: Array<Comment>,
  createdAt: string,
  __v: number,
  photoEndpoint: string
}

export type ReplyType = {
  userId: string,
  text: string,
  createdAt: string,
  _id: string
}

export type NewPost = {
  userId: string,
  content: string,
  photoFileName: string,
  likes: [],
  _id: string,
  createdAt: string,
  __v: number
}

export type CommentType = Comment
