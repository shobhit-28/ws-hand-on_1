import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomWikiArticleComponent } from './random-wiki-article.component';

describe('RandomWikiArticleComponent', () => {
  let component: RandomWikiArticleComponent;
  let fixture: ComponentFixture<RandomWikiArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomWikiArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomWikiArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
