import { Component } from '@angular/core';
import { SubRouterComponent } from './sub-router/sub-router.component';
import { RouterOutlet } from '@angular/router';
import { RandomWikiArticleComponent } from "../random-wiki-article/random-wiki-article.component";

@Component({
  selector: 'raj-chat-router-module',
  standalone: true,
  imports: [
    SubRouterComponent,
    RouterOutlet,
    RandomWikiArticleComponent
],
  templateUrl: './router-module.component.html',
  styleUrl: './router-module.component.css'
})
export class RouterModuleComponent {

}
