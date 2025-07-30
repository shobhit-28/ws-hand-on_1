import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderComponent } from "../../loader/loader.component";
import { updateProfileApiPayload, UserProfileLoader, UserProfileUser } from '../../../DTO/users.dto';
import { MatIcon } from "@angular/material/icon";
import { ChromeDataTransactionService } from '../../../services/chromeDataTransaction/chrome-data-transaction.service';
import { CoreJsService } from '../../../services/coreJs/core-js.service';
import { ChatService } from '../../../services/chat/chat.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { ProfileService } from '../edit-profile/profile.service';
import { MatMenuModule } from "@angular/material/menu";
import { ProfilePictureComponent } from '../../profile-picture/profile-picture.component';
import { ProfilePicHandlerService } from '../../../services/profilePicHandler/profile-pic-handler.service';

@Component({
  selector: 'raj-chat-top-section',
  standalone: true,
  imports: [LoaderComponent, MatIcon, MatMenuModule],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.css',
})
export class TopSectionComponent {
  @Input() loader!: UserProfileLoader
  @Input() user!: UserProfileUser
  @Input() imgUrl!: string

  @Output() ToggleFollowEmitter: EventEmitter<'follow' | 'unfollow'> = new EventEmitter()
  @Output() UserUpdationEmitter: EventEmitter<updateProfileApiPayload> = new EventEmitter()
  @Output() ProfilePictureEmitter: EventEmitter<string> = new EventEmitter()

  constructor(
    private dataService: ChromeDataTransactionService,
    private coreJsService: CoreJsService,
    private chatService: ChatService,
    private router: Router,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private profilePicService: ProfilePicHandlerService
  ) { }

  isMyAccount = (): boolean => this.user.userDetails._id === this.dataService.getCookies('user')?.id

  profileBtnClick() {
    if (this.isMyAccount()) {
      // this.editMyAccount()
    } else {
      this.toggleFollow()
    }
  }

  async editMyAccount() {
    const form = await this.profileService.createEditProfileForm()
    form.form.patchValue({
      name: this.user.userDetails.name,
      email: this.user.userDetails.email,
      bio: this.user.userDetails.bio
    })
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '400px',
      data: form
    })

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.UserUpdationEmitter.emit(res)
        }
      }, error: (err) => console.error(err)
    })
  }

  toggleFollow() {
    this.ToggleFollowEmitter.emit(this.user.status.isAlreadyFollowing ? 'unfollow' : 'follow')
  }

  copyUrl() {
    this.coreJsService.copyToClipboard(window.location.href)
  }

  messageThisUser() {
    if (!this.isMyAccount() && this.user.status.isAlreadyFollowing && this.user.status.isGettingFollowed) {
      this.chatService.setSelectedChat(this.user.userDetails)
      this.navigateToProfilePage()
    }
  }

  navigateToProfilePage() {
    const urlTree = this.router.createUrlTree(
      ['/rc', { outlets: { sideBar: ['chat'] } }]
    );
    this.router.navigateByUrl(urlTree);
  }

  async addProfilePic() {
    try {
      const { img, preview } = await this.profilePicService.triggerFileUpload()
      this.openProfilePictureUpdationComponent()
    } catch (error) {
      console.error(error)
    }
  }

  openProfilePictureUpdationComponent() {
    const dialogRef = this.dialog.open(
      ProfilePictureComponent, {
      // data: {},
      // width: '400px'
    })

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.ProfilePictureEmitter.emit(res)
        }
      }, error: (err) => console.error(err)
    })
  }
}
