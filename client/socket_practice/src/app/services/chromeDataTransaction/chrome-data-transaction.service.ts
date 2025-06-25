import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ChromeDataTransactionService {

  constructor(
    private cookieService: CookieService
  ) { }

  getCookies(key: string): any {
    const cookieVal = this.cookieService.get(key)
    if (cookieVal) {
      try {
        return JSON.parse(cookieVal)
      } catch (error) {
        return cookieVal
      }
    } else {
      return undefined
    }
  }

  public clearAllCookies(): void {
    this.cookieService.deleteAll()
  }
}
