import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChromeDataTransactionService } from '../../services/chromeDataTransaction/chrome-data-transaction.service';
import { ChatFriendsList, defaultChatFriendVal, defaultUserProfileLoaderValue, defaultUserProfileUser, GetFollowerList, GetFollowingList, updateProfileApiPayload, UserProfileLoader, UserProfileUser } from '../../DTO/users.dto';
import { UsersService } from '../../services/users/users.service';
import { CoreJsService } from '../../services/coreJs/core-js.service';
import { TopSectionComponent } from "../../Components/profile-page-components/top-section/top-section.component";

@Component({
  selector: 'raj-chat-profile-page',
  standalone: true,
  imports: [TopSectionComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  user: UserProfileUser = defaultUserProfileUser

  loader: UserProfileLoader = defaultUserProfileLoaderValue

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: ChromeDataTransactionService,
    private userService: UsersService,
    private coreJsService: CoreJsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
      await this.inititeProfilePage(params['id'])
    })
  }

  private async inititeProfilePage(profileId: string) {
    const results = await Promise.allSettled([
      this.getProfileDetails(profileId),
      this.getFollowers(profileId),
      this.getFollowing(profileId)
    ])
    this.loader['profile_pic'] = false

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Operation ${index + 1} failed:`, result.reason)
      }
    })
    console.log(this.user)
  }

  private getProfileDetails(profileId: string): Promise<void> {
    return new Promise<void>((resolve, rej) => {
      this.userService.fetchUser(profileId).subscribe({
        next: async (res) => {
          this.user['userDetails'] = res;
          if (profileId !== this.dataService.getCookies('user')?.id) {
            this.user['status'] = await this.userService.getFollowStatuses(res._id)
          }
          resolve()
        },
        error: (err) => {
          console.error(err)
          rej(err)
        }
      })
    })
  }

  private getFollowers(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userService.getFollowers(userId).subscribe({
        next: (res) => {
          this.user['followers'] = res;
          resolve()
        }, error: (err) => {
          console.error(err);
          reject()
        }
      })
    })
  }

  private getFollowing(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userService.getFollowing(userId).subscribe({
        next: (res) => {
          this.user['following'] = res,
            resolve()
        }, error: (err) => {
          console.error(err);
          reject()
        }
      })
    })
  }

  getImgOfUser = () => this.coreJsService.imgResizer(this.user.userDetails.profile_pic, 600, 600) || "/assets/profile/empty_profile_male.svg"

  followUser(userId: string) {
    this.userService.followUser(userId).subscribe({
      next: (res) => {
        this.user.status['isAlreadyFollowing'] = true
      }, error: (err) => {
        console.error(err)
      }
    })
  }

  unfollowUser(userId: string) {
    this.userService.unfollowUser(userId).subscribe({
      next: (res) => {
        this.user.status['isAlreadyFollowing'] = false
      }, error: (err) => {
        console.error(err)
      }
    })
  }

  toggleFollow(event: 'follow' | 'unfollow') {
    if (event === 'follow') {
      this.followUser(this.user.userDetails._id)
    } else {
      this.unfollowUser(this.user.userDetails._id)
    }
  }

  userUpdation(event: updateProfileApiPayload) {
    this.user['userDetails'] = { ...this.user['userDetails'], ...event }
  }

  profilePicUpdation(event: string) {
    this.user['userDetails'] = { ...this.user['userDetails'], profile_pic: event }
  }
}
