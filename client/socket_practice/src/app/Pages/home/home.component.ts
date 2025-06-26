import { Component } from '@angular/core';
import { PostsComponent } from '../../Components/posts/posts.component';
import { ChatComponent } from "../chat/chat.component";
import { posts } from '../../DTO/posts.dto';

@Component({
  selector: 'raj-chat-home',
  standalone: true,
  imports: [
    PostsComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  posts = posts
}
