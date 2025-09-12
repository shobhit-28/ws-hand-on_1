import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppComponent } from "../../app.component";
import { HomeComponent } from '../../Pages/home/home.component';
import { RouterModuleComponent } from '../router-module/router-module.component';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CoreJsService } from '../../services/coreJs/core-js.service';
import { UsersService } from '../../services/users/users.service';
import { defaultSearchedUser, SearchUserList } from '../../DTO/users.dto';
import { SingleSearchedUserComponent } from "./single-searched-user/single-searched-user.component";
import { NotificationType } from '../../DTO/notifications.dto';
import { NotificationsService } from '../../services/notifications-service/notifications.service';
import { NotificationsComponent } from "./notifications/notifications.component";

@Component({
  selector: 'raj-chat-nav-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    RouterModule,
    FormsModule
    // AsyncPipe,
    // AppComponent,
    // HomeComponent,
    // RouterModuleComponent
    ,
    SingleSearchedUserComponent,
    NotificationsComponent,
    NgClass
],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService)
  private coreJsService = inject(CoreJsService)
  private usersService = inject(UsersService)
  private notificationService = inject(NotificationsService)

  searchedUser: SearchUserList = defaultSearchedUser

  notifications: { notifications: Array<NotificationType>, isNotificationBarOpen: boolean } = {
    notifications: this.notificationService.getNotifications(),
    isNotificationBarOpen: false
  }

  debouncedSearchUser: (user: string) => void = () => { };
  loading: boolean = true;

  ngOnInit() {
    this.debouncedSearchUser = this.coreJsService.debounceFunc(this.searchUser.bind(this), 300);
  }

  isPopup = () => window.opener !== null || window.name === 'video-call'

  userName: string | null = null

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isLoggedIn = () => this.authService.isLoggedIn()

  logout = () => {
    this.authService.setIsLoggedIn(false, true);
    this.clearSearchedUser()
    this.notifications['isNotificationBarOpen'] = false
  }

  searchUserFormSubmit(chatForm: NgForm) {
    this.searchUser(chatForm.value.user)
  }

  searchUser(user: string) {
    this.loading = true
    if (user) {
      this.usersService.fetchUsers(user, 1, 5).subscribe({
        next: (res) => {
          this.searchedUser = res
          this.loading = false
          // console.log(this.searchedUser)
        }, error: (err) => {
          this.loading = false
          console.error(err)
        }
      })
    } else {
      this.searchedUser = defaultSearchedUser
    }
  }

  onNameChange(user: string) {
    this.debouncedSearchUser(user)
  }

  resetSearchUser() {
    this.searchedUser = defaultSearchedUser
  }

  clearSearchedUser() {
    this.searchedUser = defaultSearchedUser
    this.userName = null
    this.loading = true
  }

  getNotifications = (): Array<NotificationType> => this.notifications['notifications'] = this.notificationService.getNotifications()

  toggleNotificationsBar = () => this.notifications['isNotificationBarOpen'] = !this.notifications['isNotificationBarOpen']

  isNotificationsNew = () => this.notificationService.isNewNotification()
}
