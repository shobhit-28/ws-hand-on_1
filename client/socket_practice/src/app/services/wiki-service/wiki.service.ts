import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { wikiArticle } from '../../DTO/wiki.dto';

@Injectable({
  providedIn: 'root'
})
export class WikiService {

  constructor(
    private http: HttpClient
  ) { }

  getRandomArticle(): Observable<wikiArticle['data']> {
    return this.http.get<wikiArticle>('/rchat/wiki/getArticle').pipe(
      map(res => res.data)
    );
  }
}
