import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CoreJsService } from '../../services/coreJs/core-js.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Post } from '../../DTO/posts.dto';
import { ChromeDataTransactionService } from '../../services/chromeDataTransaction/chrome-data-transaction.service';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../services/postsService/posts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatFriendsList } from '../../DTO/users.dto';

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

type NumberNull = number | null
type StringNull = string | null

@Component({
  selector: 'raj-chat-posts',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  @Input() postsData: Array<Post> = new Array()

  @ViewChild('replyInput') replyInput!: ElementRef<HTMLInputElement>
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>

  debouncedLikeUnlikePost: (post: Post) => void = () => { }

  constructor(
    private coreJsService: CoreJsService,
    private cdr: ChangeDetectorRef,
    private dataTransactionService: ChromeDataTransactionService,
    private postService: PostsService
  ) { }

  ngOnInit(): void {
    this.debouncedLikeUnlikePost = this.coreJsService.debounceFunc(this.likeUnlikePost.bind(this), 300);
  }

  expandedPost: StringNull = null
  expandedReplies: {
    postIndex: StringNull;
    commentIndex: StringNull;
  } = {
      postIndex: null,
      commentIndex: null
    }
  defaultCommentReplyValue: {
    comment: {
      postIndex: null,
      comment: null
    }, reply: {
      commentId: null,
      postIndex: null,
      reply: null
    }
  } = {
      comment: {
        postIndex: null,
        comment: null
      }, reply: {
        commentId: null,
        postIndex: null,
        reply: null
      }
    }
  commentReplies: {
    comment: {
      postIndex: StringNull;
      comment: StringNull;
    };
    reply: {
      postIndex: StringNull
      commentId: StringNull;
      reply: StringNull;
    }
  } = this.coreJsService.makeDeepCopy(this.defaultCommentReplyValue)

  public parseDate = (dateStr: string): string => new Date(dateStr).toDateString();

  public isLikedByUser = (post: Post) => post.likes.find((user) => user === this.dataTransactionService.getCookies('user')?.id)

  public expandColumn = (index: string) => {
    if (index === this.expandedPost) {
      this.expandedPost = null
    } else {
      this.expandedPost = index
      this.cdr.detectChanges()
      this.focusOnHtmlComponent(this.commentInput)
    }
    this.expandedReplies = {
      postIndex: null,
      commentIndex: null
    }
    this.commentReplies = this.coreJsService.makeDeepCopy(this.defaultCommentReplyValue)
  }

  timeAgo(isoString: string) {
    const ms = new Date(isoString).getTime()
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

  isMyComment = (user: string): boolean => user === this.dataTransactionService.getCookies('user')?.id

  expandReply = (postIndex: string, commentIndex: string): void => {
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
    this.commentReplies['reply'] = this.coreJsService.makeDeepCopy(this.defaultCommentReplyValue.reply)
  }

  replyToAComment = (postIndex: string, commentIndex: string): void => {
    if (!this.isReplyExpanded(postIndex, commentIndex)) {
      this.expandReply(postIndex, commentIndex)
    }
    this.cdr.detectChanges()
    this.focusOnHtmlComponent(this.replyInput)
  }

  isReplyExpanded = (postIndex: string, commentIndex: string) => postIndex === this.expandedReplies.postIndex && commentIndex === this.expandedReplies.commentIndex

  addComment(formGroup: NgForm, postIndex: string) {
    this.postService.addCommentOnPost(postIndex, formGroup.value.Comment).subscribe({
      next: (res) => {
        this.postsData.map(post => post._id === postIndex ? { ...post, comments: post.comments.push(res) } : post)
        formGroup.reset();
      },
      error: (err) => console.error(err)
    })
  }

  addReply(formGroup: NgForm, postIndex: string, commentId: string) {
    this.postService.addReplyOnComment(commentId, formGroup.value?.Reply).subscribe({
      next: (res) => {
        this.postsData.map(post => post._id === postIndex
          ?
          {
            ...post,
            comments: post.comments.map(comment => comment._id === commentId
              ?
              {
                ...comment,
                replies: comment.replies.push(res)
              }
              :
              comment)
          }
          :
          post
        )
        formGroup.reset()
      },
      error: (err) => console.error(err)
    })
  }

  private focusOnHtmlComponent(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus()
    }
  }

  public getUrls = (text: string): Array<{ url: boolean, text: string }> => this.coreJsService.bifurcateTextIntoTextAndUrls(text)

  isMyPost = (user: string): boolean => this.dataTransactionService.getCookies('user')?.id === user

  likeUnlikePost(post: Post) {
    if (this.isLikedByUser(post)) {
      this.unlikePost(post._id)
    } else {
      this.likePost(post._id)
    }
  }

  likePost(postId: string) {
    this.postService.likePost(postId).subscribe({
      next: (res) => this.addRemoveLikes(postId, this.dataTransactionService.getCookies('user')?.id, 'add'),
      error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  unlikePost(postId: string) {
    this.postService.unlikePost(postId).subscribe({
      next: (res) => this.addRemoveLikes(postId, this.dataTransactionService.getCookies('user')?.id, 'remove'),
      error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  addRemoveLikes(postId: string, user: string, action: 'add' | 'remove'): void {
    if (action === 'add') {
      this.postsData.map((post) => post._id === postId ? { ...post, likes: post.likes.push(user) } : post)
    } else {
      this.postsData = this.postsData.map((post) => post._id === postId
        ?
        { ...post, likes: post.likes.filter(likedBy => likedBy !== user) }
        :
        post
      )
    }
  }

  deleteComment(postId: string, commentId: string) {
    this.postService.deleteComment(commentId).subscribe({
      next: () => {
        this.postsData = this.postsData.map(post => post._id === postId
          ?
          {
            ...post,
            comments: post.comments.filter(comment => comment._id !== commentId)
          }
          :
          post
        )
      },
      error: (err) => console.error(err)
    })
  }

  deleteReply(postId: string, commentId: string, replyId: string) {
    this.postService.deleteReply(commentId, replyId).subscribe({
      next: () => {
        this.postsData = this.postsData.map(post => post._id === postId
          ?
          {
            ...post,
            comments: post.comments.map(comment => comment._id === commentId
              ?
              {
                ...comment,
                replies: comment.replies.filter(reply => reply._id !== replyId)
              }
              :
              comment)
          }
          :
          post
        )
      }
    })
  }
}
