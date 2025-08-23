import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostsService } from '../../services/postsService/posts.service';
import { Post } from '../../DTO/posts.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationComponent } from '../../Components/delete-confirmation/delete-confirmation.component';
import { ChromeDataTransactionService } from '../../services/chromeDataTransaction/chrome-data-transaction.service';
import { UsersService } from '../../services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreJsService } from '../../services/coreJs/core-js.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'raj-chat-post-page',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent implements OnInit {
  post!: Post & { status: { isGettingFollowed: boolean, isAlreadyFollowing: boolean } }

  debouncedLikeUnlikePost: (post: Post) => void = () => { }
  debouncedFollowUnfollowUser: (userId: string, action: 'follow' | 'unfollow', postId: string) => void = () => { }

  expandedReply: string | null = null;

  commentReplies: {
    comment: {
      comment: string | null;
    };
    reply: {
      commentId: string | null;
      reply: string | null;
    }
  } = this.coreJsService.makeDeepCopy({
    comment: {
      comment: null,
    },
    reply: {
      commentId: null,
      reply: null,
    }
  })

  @ViewChild('replyInput') replyInput!: ElementRef<HTMLInputElement>
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostsService,
    private dataTransactionService: ChromeDataTransactionService,
    private userService: UsersService,
    private dialog: MatDialog,
    private router: Router,
    private coreJsService: CoreJsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
      await this.initiatePostPage(params['id']);
      console.log(this.post);
    });

    this.debouncedLikeUnlikePost = this.coreJsService.debounceFunc(this.likeUnlikePost.bind(this), 300);
    this.debouncedFollowUnfollowUser = this.coreJsService.debounceFunc(this.followUnfollow.bind(this), 300);
  }

  async initiatePostPage(postId: string): Promise<void> {
    try {
      const res = await firstValueFrom(this.postService.getPostByPostId(postId));
      this.post = {
        ...res,
        status: await this.userService.getFollowStatuses(res.userId._id)
      };
    } catch (err) {
      this.router.navigateByUrl('')
      console.error(err);
    }
  }
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
      next: (res) => this.addRemoveLikes(this.dataTransactionService.getCookies('user')?.id, 'add'),
      error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  unlikePost(postId: string) {
    this.postService.unlikePost(postId).subscribe({
      next: (res) => this.addRemoveLikes(this.dataTransactionService.getCookies('user')?.id, 'remove'),
      error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  addRemoveLikes(user: string, action: 'add' | 'remove'): void {
    if (action === 'add') {
      this.post.likes.push(user)
    } else {
      this.post['likes'] = this.post.likes.filter(likedBy => likedBy !== user)
    }
  }

  deleteComment(postId: string, commentId: string) {
    this.postService.deleteComment(commentId).subscribe({
      next: () => {
        this.post['comments'] = this.post.comments.filter(comment => comment._id !== commentId)
      },
      error: (err) => console.error(err)
    })
  }

  deleteReply(postId: string, commentId: string, replyId: string) {
    this.postService.deleteReply(commentId, replyId).subscribe({
      next: () => {
        this.post['comments'] = this.post.comments.map(comment => comment._id === commentId
          ?
          {
            ...comment,
            replies: comment.replies.filter(reply => reply._id !== replyId)
          }
          :
          comment)
      }
    })
  }

  followUnfollow(userId: string, action: 'follow' | 'unfollow', postId: string) {
    if (action === 'follow') {
      this.followUser(userId, postId)
    } else {
      this.unfollowUser(userId, postId)
    }
  }

  followUser(user: string, postId: string) {
    this.userService.followUser(user).subscribe({
      next: () => {
        this.post['status'] = { ...this.post.status, isAlreadyFollowing: true }
      }, error: (err) => console.error(err)
    })
  }

  unfollowUser(user: string, postId: string) {
    this.userService.unfollowUser(user).subscribe({
      next: () => {
        this.post['status'] = { ...this.post.status, isAlreadyFollowing: false }
      }, error: (err) => console.error(err)
    })
  }

  deleteConfirmation(postId: string) {
    const dialogRef = this.dialog.open(
      DeleteConfirmationComponent, {
      data: {
        dialog: `Are you sure you want to delete this post?`,
        buttonNames: {
          YES: `Delete`,
          NO: "Cancel"
        }
      },
      width: '400px'
    })

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'YES') {
          this.deletePost(postId)
        }
      }, error: (err) => {
        console.error(err)
      }
    })
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.router.navigateByUrl('/')
      }, error: (err) => console.error(err)
    })
  }

  sharePost(postId: string) {
    this.coreJsService.copyToClipboard(postId)
  }

  public isLikedByUser = (post: Post) => post.likes.find((user) => user === this.dataTransactionService.getCookies('user')?.id)

  public parseDate = (dateStr: string): string => new Date(dateStr).toDateString();

  public getUrls = (text: string): Array<{ url: boolean, text: string }> => this.coreJsService.bifurcateTextIntoTextAndUrls(text)

  timeAgo = (isoString: string) => this.coreJsService.timeAgo(isoString)

  isMyComment = (user: string): boolean => user === this.dataTransactionService.getCookies('user')?.id

  replyToAComment = (postIndex: string, commentIndex: string): void => {
    if (!this.isReplyExpanded(postIndex, commentIndex)) {
      this.expandReply(postIndex, commentIndex)
    }
    this.cdr.detectChanges()
    this.focusOnHtmlComponent(this.replyInput)
  }

  expandReply = (postIndex: string, commentIndex: string): void => {
    if (commentIndex === this.expandedReply) {
      this.expandedReply = null
    } else {
      this.expandedReply = commentIndex
    }
    this.commentReplies['reply'] = this.coreJsService.makeDeepCopy({
      commentId: null,
      reply: null,
    })
  }

  isReplyExpanded = (postIndex: string, commentIndex: string) => commentIndex === this.expandedReply

  addComment(formGroup: NgForm, postIndex: string) {
    this.postService.addCommentOnPost(postIndex, formGroup.value.Comment).subscribe({
      next: (res) => {
        this.post.comments.push(res)
        formGroup.reset();
      },
      error: (err) => console.error(err)
    })
  }

  getProfilePic = (img: string) => this.coreJsService.getEmptyProfilePic(img)

  focusOnHtmlComponent(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus()
    }
  }

  addReply(formGroup: NgForm, postIndex: string, commentId: string) {
    this.postService.addReplyOnComment(commentId, formGroup.value?.Reply).subscribe({
      next: (res) => {
        this.post.comments.map(comment => comment._id === commentId
          ?
          {
            ...comment,
            replies: comment.replies.push(res)
          }
          :
          comment
        )
        formGroup.reset()
      },
      error: (err) => console.error(err)
    })
  }

  navigateToProfileId(profileId: string) {
    this.coreJsService.navigateToProfilePage(profileId)
  }
}
