import { TestBed } from '@angular/core/testing';

import { CallServiceService } from './call-service.service';

describe('CallServiceService', () => {
  let service: CallServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
