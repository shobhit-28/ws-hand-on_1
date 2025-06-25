import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthPageComponent } from './Pages/auth-page/auth-page.component';
import { ExploreComponent } from './Pages/explore/explore.component';
import { ChatComponent } from './Pages/chat/chat.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'auth', component: AuthPageComponent},
    {path: 'explore', component: ExploreComponent},
    {path: 'chat', component: ChatComponent},
];
