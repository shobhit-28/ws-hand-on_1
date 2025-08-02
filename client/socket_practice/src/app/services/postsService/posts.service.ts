import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { Post } from '../../DTO/posts.dto';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private http: HttpClient
  ) { }

  getPostByUserId(userId: string): Observable<Array<Post>> {
    return this.http.get<ApiResponse<Array<Post>>>(`/rchat/post/getPostWithUserId/${userId}`).pipe(
      map(res => res.data)
    )
  }

  getPosts(): Observable<Array<Post>> {
    return this.http.get<ApiResponse<Array<Post>>>(`/rchat/post/getAll`).pipe(
      map(res => res.data)
    )
  }
}
