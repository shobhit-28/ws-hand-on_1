import { Component, OnInit } from '@angular/core';
import { PostsComponent } from '../../Components/posts/posts.component';
import { ChatComponent } from "../chat/chat.component";
import { Post } from '../../DTO/posts.dto';
import { PostsService } from '../../services/postsService/posts.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'raj-chat-home',
  standalone: true,
  imports: [
    PostsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    private postService: PostsService,
    private userService: UsersService
  ) { }

  posts: Array<Post & { status: { isGettingFollowed: boolean, isAlreadyFollowing: boolean } }> = new Array()

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: async (res) => {
        this.posts = await Promise.all(
          res.map(async post => ({
            ...post,
            status: await this.userService.getFollowStatuses(post.userId._id)
          }))
        )
      },
      error: (err) => console.error(err)
    })
  }
}
