import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChromeDataTransactionService } from '../../services/chromeDataTransaction/chrome-data-transaction.service';
import { ChatFriendsList, defaultChatFriendVal, GetFollowerList, GetFollowingList } from '../../DTO/users.dto';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'raj-chat-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  user: {
    userDetails: ChatFriendsList,
    followers: GetFollowerList,
    following: GetFollowingList
  } = {
      userDetails: defaultChatFriendVal,
      followers: new Array(),
      following: new Array()
    }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: ChromeDataTransactionService,
    private userService: UsersService
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

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Operation ${index + 1} failed:`, result.reason)
      }
    })
    console.log(this.user)
  }

  private getProfileDetails(profileId: string): Promise<void> {
    return new Promise<void>((resolve, rej) => {
      if (profileId === this.dataService.getCookies('user')?.id) {
        this.user['userDetails'] = this.dataService.getCookies('user')
        resolve()
      } else {
        this.userService.fetchUser(profileId).subscribe({
          next: (res) => {
            this.user['userDetails'] = res;
            resolve()
          },
          error: (err) => {
            console.error(err)
            rej(err)
          }
        })
      }
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
}
