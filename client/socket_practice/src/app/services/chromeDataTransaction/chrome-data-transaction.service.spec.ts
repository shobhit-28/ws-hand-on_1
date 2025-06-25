import { TestBed } from '@angular/core/testing';

import { ChromeDataTransactionService } from './chrome-data-transaction.service';

describe('ChromeDataTransactionService', () => {
  let service: ChromeDataTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChromeDataTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
