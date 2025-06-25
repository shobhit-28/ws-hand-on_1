import { Injectable } from '@angular/core';
import { ChromeDataTransactionService } from '../chromeDataTransaction/chrome-data-transaction.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitialiserService {

  constructor(
    private chromeDataTransactionService: ChromeDataTransactionService,
    private centralAuthService: AuthService
  ) { }

  initFunc(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        if (this.chromeDataTransactionService.getCookies('token')) {
          this.centralAuthService.setIsLoggedIn(true)
        } else {
          this.centralAuthService.setIsLoggedIn(false)
        }
        resolve()
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
}
