import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public askForBrowserNotificationPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  public sendBrowserNotification(messageHeader: string, message: string, isActiveTabNotification: boolean) {
    let browserCondition: boolean = isActiveTabNotification ? document.hidden : true
    this.askForBrowserNotificationPermission()
    if (browserCondition && Notification.permission === 'granted') {
      new Notification(messageHeader, {
        body: message
      });
    }
  }
}
