import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'raj-chat-sub-router',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule
  ],
  templateUrl: './sub-router.component.html',
  styleUrl: './sub-router.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubRouterComponent {
  routes = Object.freeze([
    { path: 'explore', name: 'Explore', icon: 'explore' },
    { path: 'chat', name: 'Chat', icon: 'chat' }
  ]);

  userDetails: {
    userName: string,
    userEmail: string,
    userImg?: string
  } = {
    userName: 'Shobhit Raj',
    userEmail: 's@gm.co'
  }
}
