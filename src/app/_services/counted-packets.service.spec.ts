import { TestBed } from '@angular/core/testing';

import { CountedPacketsService } from './counted-packets.service';

describe('CountedPacketsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountedPacketsService = TestBed.get(CountedPacketsService);
    expect(service).toBeTruthy();
  });
});
