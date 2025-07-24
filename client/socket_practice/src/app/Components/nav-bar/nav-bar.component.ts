import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppComponent } from "../../app.component";
import { HomeComponent } from '../../Pages/home/home.component';
import { RouterModuleComponent } from '../router-module/router-module.component';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CoreJsService } from '../../services/coreJs/core-js.service';

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
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService)
  private coreJsService = inject(CoreJsService)

  debouncedSearchUser: (user: string) => void = () => {};

  ngOnInit() {
    this.debouncedSearchUser = this.coreJsService.debounceFunc(this.searchUser.bind(this), 500);
  }

  userName: string | null = null

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isLoggedIn = () => this.authService.isLoggedIn()

  logout = () => this.authService.setIsLoggedIn(false, true)

  searchUserFormSubmit(chatForm: NgForm) {
    this.searchUser(chatForm.value.user)
  }

  searchUser(user: string) {
    if (user) {
      console.log(user)
    }
  }

  onNameChange(user: string) {
    this.debouncedSearchUser(user)
  }
}
