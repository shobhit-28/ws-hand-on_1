import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthPageComponent } from './Pages/auth-page/auth-page.component';
import { ExploreComponent } from './Pages/explore/explore.component';
import { ChatComponent } from './Pages/chat/chat.component';
import { RouterModuleComponent } from './Components/router-module/router-module.component';

export const routes: Routes = [
  { path: '', redirectTo: 'rc', pathMatch: 'full' },
  {
    path: 'rc', component: RouterModuleComponent, children: [
      { path: '', component: HomeComponent, outlet: 'sideBar' },
      { path: 'explore', component: ExploreComponent, outlet: 'sideBar' },
      { path: 'chat', component: ChatComponent, outlet: 'sideBar' }
    ]
  },

  // { path: 'home', component: HomeComponent, outlet: 'sideBar' },
  // { path: 'explore', component: ExploreComponent, outlet: 'sideBar' },
  // { path: 'chat', component: ChatComponent, outlet: 'sideBar' },

  { path: 'auth', component: AuthPageComponent }
];
