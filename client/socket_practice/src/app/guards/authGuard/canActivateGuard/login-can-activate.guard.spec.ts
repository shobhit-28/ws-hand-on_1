import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginCanActivateGuard } from './login-can-activate.guard';

describe('loginCanActivateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginCanActivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
