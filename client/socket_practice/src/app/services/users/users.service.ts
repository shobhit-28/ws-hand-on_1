import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { ChatFriendsList, GetFollowerList, GetFollowingList, SearchUserList } from '../../DTO/users.dto';
import { map, Observable } from 'rxjs';
import { ChromeDataTransactionService } from '../chromeDataTransaction/chrome-data-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private dataService: ChromeDataTransactionService
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

  fetchUser(userId: string): Observable<ChatFriendsList> {
    return this.http.get<ApiResponse<ChatFriendsList>>(`/rchat/user/getUser/${userId}`).pipe(
      map(res => res.data)
    )
  }

  getFollowers(userId: string): Observable<GetFollowerList> {
    const url = userId === this.dataService.getCookies('user')?.id
      ? '/rchat/toggle-follow/followers'
      : `/rchat/toggle-follow/followers/${userId}`
    return this.http.get<ApiResponse<GetFollowerList>>(url).pipe(
      map(res => res.data)
    )
  }

  getFollowing(userId: string): Observable<GetFollowingList> {
    const url = userId === this.dataService.getCookies('user')?.id
      ? '/rchat/toggle-follow/following'
      : `/rchat/toggle-follow/following/${userId}`
    return this.http.get<ApiResponse<GetFollowingList>>(url).pipe(
      map(res => res.data)
    )
  }
}
