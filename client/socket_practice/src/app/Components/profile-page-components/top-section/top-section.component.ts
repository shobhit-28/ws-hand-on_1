import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderComponent } from "../../loader/loader.component";
import { UserProfileLoader, UserProfileUser } from '../../../DTO/users.dto';
import { MatIcon } from "@angular/material/icon";
import { ChromeDataTransactionService } from '../../../services/chromeDataTransaction/chrome-data-transaction.service';
import { CoreJsService } from '../../../services/coreJs/core-js.service';
import { ChatService } from '../../../services/chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'raj-chat-top-section',
  standalone: true,
  imports: [LoaderComponent, MatIcon],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.css',
})
export class TopSectionComponent {
  @Input() loader!: UserProfileLoader
  @Input() user!: UserProfileUser
  @Input() imgUrl!: string

  @Output() ToggleFollowEmitter: EventEmitter<'follow' | 'unfollow'> = new EventEmitter()

  constructor(
    private dataService: ChromeDataTransactionService,
    private coreJsService: CoreJsService,
    private chatService: ChatService,
    private router: Router
  ) { }

  isMyAccount = (): boolean => this.user.userDetails._id === this.dataService.getCookies('user')?.id

  profileBtnClick() {
    if (this.isMyAccount()) {
      this.editMyAccount()
    } else {
      this.toggleFollow()
    }
  }

  editMyAccount() {
    console.log(`edit`)
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
}
