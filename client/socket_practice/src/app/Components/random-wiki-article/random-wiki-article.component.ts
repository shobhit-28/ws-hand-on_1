import { Component } from '@angular/core';
import { WikiService } from '../../services/wiki-service/wiki.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'raj-chat-random-wiki-article',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './random-wiki-article.component.html',
  styleUrl: './random-wiki-article.component.css'
})
export class RandomWikiArticleComponent {
  article: any = null;
  loading = true;

  ngOnInit() {
    this.loadArticle();
  }

  constructor(
    private wiki: WikiService
  ) { }

  loadArticle() {
    this.loading = true;
    this.wiki.getRandomArticle().subscribe(res => {
      console.log(res)
      this.article = res;
      this.loading = false;
    });
  }
}
