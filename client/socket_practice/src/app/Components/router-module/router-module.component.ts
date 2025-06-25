import { Component } from '@angular/core';
import { SubRouterComponent } from './sub-router/sub-router.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'raj-chat-router-module',
  standalone: true,
  imports: [
    SubRouterComponent,
    RouterOutlet
  ],
  templateUrl: './router-module.component.html',
  styleUrl: './router-module.component.css'
})
export class RouterModuleComponent {

}
