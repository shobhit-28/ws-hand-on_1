import { Routes } from '@angular/router';
import { RouterModuleComponent } from './Components/router-module/router-module.component';
import { loginCanMatchGuard } from './guards/authGuard/canMatchGuard/login-can-match.guard';
import { loginCanActivateGuard } from './guards/authGuard/canActivateGuard/login-can-activate.guard';
import { AuthPageComponent } from './Pages/auth-page/auth-page.component';
import { signOutGuardGuard } from './guards/authGuard/signOutGuard/sign-out-guard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'rc', pathMatch: 'full' },
  {
    path: 'rc',
    component: RouterModuleComponent,
    children: [
      {
        path: '',
        // component: HomeComponent,
        loadComponent: () => import('./Pages/home/home.component').then((m) => m.HomeComponent),
        canMatch: [loginCanMatchGuard], canActivate: [loginCanActivateGuard],
        outlet: 'sideBar'
      },
      {
        path: 'explore',
        // component: ExploreComponent,
        loadComponent: () => import('./Pages/explore/explore.component').then((m) => m.ExploreComponent),
        canMatch: [loginCanMatchGuard], canActivate: [loginCanActivateGuard],
        outlet: 'sideBar'
      },
      {
        path: 'chat',
        // component: ChatComponent,
        loadComponent: () => import('./Pages/chat/chat.component').then((m) => m.ChatComponent),
        canMatch: [loginCanMatchGuard], canActivate: [loginCanActivateGuard],
        outlet: 'sideBar'
      },
      {
        path: 'profile/:id',
        loadComponent: () => import('./Pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
        canMatch: [loginCanMatchGuard], canActivate: [loginCanActivateGuard],
        outlet: 'sideBar'
      },
      {
        path: 'post/:id',
        loadComponent: () => import('./Pages/post-page/post-page.component').then((m) => m.PostPageComponent),
        canMatch: [loginCanMatchGuard], canActivate: [loginCanActivateGuard],
        outlet: 'sideBar'
      }
    ]
  },
  {
    path: 'auth',
    component: AuthPageComponent,
    canActivate: [signOutGuardGuard]
  }
];
