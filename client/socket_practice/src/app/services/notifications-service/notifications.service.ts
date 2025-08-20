import { HttpClient } from '@angular/common/http';
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

  getNotifications(): Array<NotificationType> {
    return this.notificationsArr
  }
}
