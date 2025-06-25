import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { loginCanMatchGuard } from './login-can-match.guard';

describe('loginCanMatchGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginCanMatchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
