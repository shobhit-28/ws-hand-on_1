import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { CommentType, Post } from '../../DTO/posts.dto';
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

  addCommentOnPost(postId: string, text: string): Observable<CommentType> {
    const payload = { postId, text }

    return this.http.post<ApiResponse<CommentType>>('/rchat/post/addComment', payload).pipe(
      map(res => res.data)
    )
  }

  addReplyOnComment(commentId: string, reply: string): Observable<CommentType> {
    const payload = { commentId, reply };

    return this.http.post<ApiResponse<CommentType>>('/rchat/post/addReply', payload).pipe(
      map(res => res.data)
    )
  }

  editComment(commentId: string, newComment: string): Observable<CommentType> {
    const payload = { commentId, newComment }

    return this.http.put<ApiResponse<CommentType>>('/rchat/post/editComment', payload).pipe(
      map(res => res.data)
    )
  }

  editReply(commentId: string, replyId: string, newReply: string): Observable<CommentType> {
    const payload = { commentId, replyId, newReply }

    return this.http.put<ApiResponse<CommentType>>('/rchat/post/editReply', payload).pipe(
      map(res => res.data)
    )
  }

  deleteComment(commentId: string): Observable<null> {
    return this.http.delete<null>(`/rchat/post/deleteComment/${commentId}`)
  }

  deleteReply(commentId: string, replyId: string): Observable<null> {
    // console.log(commentId, replyId)
    const params = new HttpParams()
      .set('commentId', commentId)
      .set('replyId', replyId)

    return this.http.delete<null>('/rchat/post/deleteReply', { params })
  }

  deletePost(postId: string): Observable<null> {
    return this.http.delete<null>(`/rchat/post/deletePost/${postId}`)
  }

  likePost(postId: string): Observable<Post> {
    return this.http.put<ApiResponse<Post>>('/rchat/post/like', { postId }).pipe(
      map(res => res.data)
    )
  }

  unlikePost(postId: string): Observable<Post> {
    return this.http.put<ApiResponse<Post>>('/rchat/post/unlike', { postId }).pipe(
      map(res => res.data)
    )
  }

  getPostByPostId(postId: string): Observable<Post> {
    return this.http.get<ApiResponse<Post>>(`/rchat/post/post/${postId}`).pipe(
      map(res => res.data)
    )
  }
}
