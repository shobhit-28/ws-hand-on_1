import { TestBed } from '@angular/core/testing';

import { CoreJsService } from './core-js.service';

describe('CoreJsService', () => {
  let service: CoreJsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreJsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
