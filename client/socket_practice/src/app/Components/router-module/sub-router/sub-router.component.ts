import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ChromeDataTransactionService } from '../../../services/chromeDataTransaction/chrome-data-transaction.service';
import { CoreJsService } from '../../../services/coreJs/core-js.service';

@Component({
  selector: 'raj-chat-sub-router',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule
  ],
  templateUrl: './sub-router.component.html',
  styleUrl: './sub-router.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubRouterComponent {
  routes = Object.freeze([
    { path: 'explore', name: 'Explore', icon: 'explore' },
    { path: 'chat', name: 'Chat', icon: 'chat' }
  ]);

  constructor(
    private dataService: ChromeDataTransactionService,
    private coreJsService: CoreJsService
  ) { }

  userDetails: {
    userName: string,
    userEmail: string,
    userImg?: string
  } = {
      userName: 'Shobhit Raj',
      userEmail: 's@gm.co'
    }

  getUserDetails = () => this.dataService.getCookies('user')

  getImgOfUser = () => this.coreJsService.imgResizer(this.getUserDetails()?.profile_pic, 400, 400) || "/assets/profile/empty_profile_male.svg"
}
