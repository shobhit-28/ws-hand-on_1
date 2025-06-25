import { TestBed } from '@angular/core/testing';

import { AppInitialiserService } from './app-initialiser.service';

describe('AppInitialiserService', () => {
  let service: AppInitialiserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitialiserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
