import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signOutGuardGuard } from './sign-out-guard.guard';

describe('signOutGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signOutGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
