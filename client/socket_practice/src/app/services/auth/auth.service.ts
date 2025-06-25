import { Injectable } from '@angular/core';
import { ChromeDataTransactionService } from '../chromeDataTransaction/chrome-data-transaction.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private chromeDataTransactionService: ChromeDataTransactionService,
    private router: Router
  ) { }

  private isLoggedInFlag!: boolean

  setIsLoggedIn(flag: boolean) {
    this.isLoggedInFlag = flag;
    if (flag) {
      this.router.navigateByUrl('')
    } else {
      this.router.navigateByUrl('/auth')
      this.chromeDataTransactionService.clearAllCookies()
    }
  }

  public isLoggedIn = () => this.isLoggedInFlag
}
