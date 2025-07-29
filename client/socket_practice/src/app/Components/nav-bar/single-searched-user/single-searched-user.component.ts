import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchUserList } from '../../../DTO/users.dto';
import { LoaderComponent } from "../../loader/loader.component";
import { CoreJsService } from '../../../services/coreJs/core-js.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'raj-chat-single-searched-user',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './single-searched-user.component.html',
  styleUrl: './single-searched-user.component.css',
})
export class SingleSearchedUserComponent implements AfterViewInit {
  @Input() users!: SearchUserList
  @Input() loading!: boolean
  @Input() searchedText!: string | null

  @Output() navigationEmitter: EventEmitter<void> = new EventEmitter()

  viewMoreLoading: boolean = false

  constructor(
    private coreJsService: CoreJsService,
    private userService: UsersService
  ) { }

  ngAfterViewInit(): void {
    console.log(this.users)
  }

  getResizedImg = (url: string | undefined) => url ? this.coreJsService.imgResizer(url, 400, 400) : '/assets/profile/empty_profile_male.svg'

  returnTruncatedStr = (str: string, maxLen: number) => this.coreJsService.truncateText(str, maxLen)

  showMore() {
    if (this.searchedText) {
      this.viewMoreLoading = true
      this.userService.fetchUsers(this.searchedText, this.users.page + 1, this.users.limit).subscribe({
        next: (res) => {
          this.users = {
            ...res,
            users: [...this.users.users, ...res.users]
          }
          this.viewMoreLoading = false
        }, error: (err) => {
          this.viewMoreLoading = false
          console.error(err)
        }
      })
    }
  }

  getButtonType(user: SearchUserList['users'][0]): 'Unfollow' | 'Follow' {
    if (user.relationship === 'mutual' || user.relationship === 'following') {
      return 'Unfollow'
    } else {
      return 'Follow'
    }
  }

  followUnfollowUser(toggleType: 'Unfollow' | 'Follow', userId: string) {
    if (toggleType === 'Follow') {
      this.followUser(userId)
    } else {
      this.unfollowUser(userId)
    }
  }

  followUser(userId: string) {
    this.userService.followUser(userId).subscribe({
      next: (res) => {
        console.log(res)
        this.users['users'] = this.users.users.map(user => user._id === userId ? { ...user, relationship: 'following' } : user)
      }, error: (err) => {
        console.error(err)
      }
    })
  }

  unfollowUser(userId: string) {
    this.userService.unfollowUser(userId).subscribe({
      next: (res) => {
        console.log(res)
        this.users['users'] = this.users.users.map(user => user._id === userId ? { ...user, relationship: 'none' } : user)
      }, error: (err) => {
        console.error(err)
      }
    })
  }

  navigateToUserProfile(userId: string) {
    this.coreJsService.navigateToProfilePage(userId)
    this.navigationEmitter.emit()
  }
}
