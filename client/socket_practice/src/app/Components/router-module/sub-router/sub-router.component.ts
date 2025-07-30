import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ChromeDataTransactionService } from '../../../services/chromeDataTransaction/chrome-data-transaction.service';
import { CoreJsService } from '../../../services/coreJs/core-js.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ProfilePictureComponent } from '../../profile-picture/profile-picture.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfilePicHandlerService } from '../../../services/profilePicHandler/profile-pic-handler.service';

@Component({
  selector: 'raj-chat-sub-router',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './sub-router.component.html',
  styleUrl: './sub-router.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubRouterComponent {
  routes = Object.freeze([
    { path: 'explore', name: 'Explore', icon: 'explore' },
    { path: 'chat', name: 'Chat', icon: 'chat' }
  ]);
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private dataService: ChromeDataTransactionService,
    private coreJsService: CoreJsService,
    private dialog: MatDialog,
    private profilePicService: ProfilePicHandlerService
  ) { }

  getUserDetails = () => this.dataService.getCookies('user')

  getImgOfUser = () => this.coreJsService.imgResizer(this.getUserDetails()?.profile_pic, 400, 400) || "/assets/profile/empty_profile_male.svg"

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
          console.log(res)
        }
      }, error: (err) => console.error(err)
    })
  }

  getProfileId = (): string =>  this.dataService.getCookies('user')?.id

  navigateToProfile() {
    this.coreJsService.navigateToProfilePage(this.dataService.getCookies('user')?.id)
  }
}
