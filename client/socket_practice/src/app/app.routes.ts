import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthPageComponent } from './Pages/auth-page/auth-page.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'auth', component: AuthPageComponent},
];
