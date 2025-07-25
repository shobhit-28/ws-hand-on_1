import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { AuthPageComponent } from './Pages/auth-page/auth-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'socket_practice';
}
