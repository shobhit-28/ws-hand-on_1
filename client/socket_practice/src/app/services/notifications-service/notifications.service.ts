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

  getNotifications(): Array<NotificationType> {
    return this.notificationsArr
  }
}
