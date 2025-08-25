import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/postsService/posts.service';
import { UsersService } from '../../services/users/users.service';
import { Post } from '../../DTO/posts.dto';
import { PostsComponent } from "../../Components/posts/posts.component";

@Component({
  selector: 'raj-chat-explore',
  standalone: true,
  imports: [PostsComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
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
