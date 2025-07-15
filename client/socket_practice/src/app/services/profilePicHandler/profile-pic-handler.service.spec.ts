import { TestBed } from '@angular/core/testing';

import { ProfilePicHandlerService } from './profile-pic-handler.service';

describe('ProfilePicHandlerService', () => {
  let service: ProfilePicHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilePicHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
