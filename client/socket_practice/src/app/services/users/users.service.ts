import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { SearchUserList } from '../../DTO/users.dto';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  fetchUsers(user: string, page: number, limit: number): Observable<SearchUserList> {
    return this.http.get<ApiResponse<SearchUserList>>(`/rchat/user/searchUser/${user}?page=${page}&limit=${limit}`).pipe(
      map((res) => res.data)
    )
  }

  followUser(userId: string): Observable<string> {
    return this.http.post<ApiResponse<{}>>(`/rchat/toggle-follow/follow`, {
      followingId: userId
    }).pipe(
      map(res => res.message)
    )
  }

  unfollowUser(userId: string): Observable<void> {
    return this.http.delete<void>('/rchat/toggle-follow/unfollow', {
      body: {
        followingId: userId
      }
    })
  }
}
