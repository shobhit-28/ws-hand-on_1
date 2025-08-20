import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

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

  public showSnackBar(message: string, type: 'success' | 'failure' | 'neutral', duration?: number) {
    this.snackBar.open(message, 'Close', {
      duration: duration ?? 1000,
      panelClass: [`snackbar-${type}`]
    })
  }
}
