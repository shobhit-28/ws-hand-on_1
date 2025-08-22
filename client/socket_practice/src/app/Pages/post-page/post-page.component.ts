import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'raj-chat-post-page',
  standalone: true,
  imports: [],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
      this.initiatePostPage(params['id'])
    })
  }

  initiatePostPage(profileId: string) {
    console.log(profileId)
  }

}
