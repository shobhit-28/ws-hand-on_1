import { Routes } from '@angular/router';
import { RouterModuleComponent } from './Components/router-module/router-module.component';
import { loginCanMatchGuard } from './guards/authGuard/canMatchGuard/login-can-match.guard';
import { loginCanActivateGuard } from './guards/authGuard/canActivateGuard/login-can-activate.guard';
import { AuthPageComponent } from './Pages/auth-page/auth-page.component';

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
      }
    ]
  },
  {
    path: 'auth',
    component: AuthPageComponent,
    // loadComponent: () => import('./Pages/auth-page/auth-page.component').then((m) => m.AuthPageComponent),
    // canActivate: [loginCanActivateGuard],
    // data: { isAuth: true }
  }
];
