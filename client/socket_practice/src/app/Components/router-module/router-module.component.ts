import { Component } from '@angular/core';
import { SubRouterComponent } from './sub-router/sub-router.component';

@Component({
  selector: 'raj-chat-router-module',
  standalone: true,
  imports: [
    SubRouterComponent
  ],
  templateUrl: './router-module.component.html',
  styleUrl: './router-module.component.css'
})
export class RouterModuleComponent {

}
