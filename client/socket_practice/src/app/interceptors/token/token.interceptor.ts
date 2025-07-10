import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ChromeDataTransactionService } from '../../services/chromeDataTransaction/chrome-data-transaction.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const chromeDataStorage = inject(ChromeDataTransactionService)

  if (req.url.toLowerCase().includes('/auth')) {
    return next(req)
  } else {
    const token = chromeDataStorage.getCookies('token')

    if (token) {
      req = req.clone({
        setHeaders: {
          authToken: `RChatToken ${token}`
        }
      })
    }

    return next(req);
  }
};
