import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type User = {
  _id: string
  firstName: string
  lastName: string
  username: string
  profile_pic: string
}

type Reply = {
  _id: string
  user: User
  content: string
}

type Comment = {
  _id: string
  content: string
  postId: string
  user: User
  replies: Reply[]
  createdAt: number
  updatedAt: number
}

type Post = {
  _id: string
  content: string
  pic: string
  username: string
  postedBy: User
  likes: {
    likeCount: number
    likedBy: User[]
    dislikedBy: User[]
  }
  comments: Comment[]
  createdAt: number
  updatedAt: number
}

type NumberNull = number | null
type StringNull = string | null

@Component({
  selector: 'raj-chat-posts',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  @Input() postsData: Array<Post> = new Array()

  expandedPost: NumberNull = null
  expandedReplies: {
    postIndex: NumberNull;
    commentIndex: StringNull;
  } = {
      postIndex: null,
      commentIndex: null
    }

  public parseDate = (dateStr: number): string => new Date(dateStr).toDateString();

  public isLikedByUser = (post: Post) => post.likes.likedBy.find((user) => user.username === 'shobhitraj')

  public expandColumn = (index: number) => {
    if (index === this.expandedPost) {
      this.expandedPost = null
    } else {
      this.expandedPost = index
    }
    this.expandedReplies = {
      postIndex: null,
      commentIndex: null
    }
  }

  timeAgo(ms: number): string {
    const now = Date.now()
    const diff = Math.max(0, now - ms)

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const months = Math.floor(diff / (30 * 86400000))
    const years = Math.floor(diff / (365 * 86400000))

    if (years > 0) return `${years}y`
    if (months > 0) return `${months}m`
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }

  isMyComment = (user: User): boolean => user.username === 'shobhitraj'

  expandReply = (postIndex: number, commentIndex: string): void => {
    if (postIndex === this.expandedReplies.postIndex && commentIndex === this.expandedReplies.commentIndex) {
      this.expandedReplies = {
        postIndex: null,
        commentIndex: null
      }
    } else {
      this.expandedReplies = {
        postIndex, commentIndex
      }
    }
  }
}
