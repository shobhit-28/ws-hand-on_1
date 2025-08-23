import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../DTO/commonResponse.dto';
import { map, Observable } from 'rxjs';
import { NotificationType } from '../../DTO/notifications.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsArr: Array<NotificationType> = new Array()

  constructor(
    private http: HttpClient
  ) { }

  public getNotification(): void {
    this.http.get<ApiResponse<Array<NotificationType>>>(`/rchat/notification/getAll`).subscribe({
      next: (res) => {
        this.notificationsArr = res.data
      }, error: (err) => console.error(err)
    })
  }

  public markNotificationAsRead(notificationId: string): void {
    this.http.post<ApiResponse<NotificationType>>(`/rchat/notification/markasread`, {
      notificationId
    }).subscribe({
      next: (res) => {
        this.notificationsArr = this.notificationsArr
          .map(notification => res.data._id === notification._id
            ?
            { ...notification, isRead: true }
            :
            notification
          )
      }, error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  public deleteNotification(notificationId: string): void {
    this.http.delete(`/rchat/notification/deleteNotification/${notificationId}`).subscribe({
      next: () => {
        this.notificationsArr = this.notificationsArr.filter(notification => notification._id !== notificationId)
      }, error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  public markAllNotificationsAsRead(): void {
    this.http.post<ApiResponse<Array<NotificationType>>>('/rchat/notification/markallasread', {}).subscribe({
      next: () => {
        this.notificationsArr = this.notificationsArr.map((notification) => ({ ...notification, isRead: true }))
      }, error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  public deleteAllNotifications(): void {
    this.http.delete('/rchat/notification/clearNotifications').subscribe({
      next: () => {
        this.notificationsArr = []
      }, error: (err: HttpErrorResponse) => console.error(err)
    })
  }

  public getNotifications(): Array<NotificationType> {
    return this.notificationsArr
  }

  public isNewNotification = (): boolean => this.notificationsArr.some(notification => !notification.isRead)

  public addNewNotification(notification: NotificationType) {
    this.notificationsArr = [notification, ...this.notificationsArr]
  }

  public removeNotification(notification: NotificationType) {
    this.notificationsArr = this.notificationsArr.filter(n => n._id !== notification._id)
    console.log(notification)
    console.log(this.notificationsArr)
    console.log(this.notificationsArr.filter(n => n.postId?._id !== notification.postId?._id))
    console.log(notification.postId?._id)
    switch (notification.type) {
      case 'comment':
        this.notificationsArr = this.notificationsArr.filter(n => n.commentId !== notification.commentId)
        break;

      case 'Post Removal':
        this.notificationsArr = this.notificationsArr.filter(n => n.postId?._id !== notification.postId?._id)
        break;

      default:
        break;
    }
  }
}
