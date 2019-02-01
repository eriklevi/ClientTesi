import { TestBed } from '@angular/core/testing';

import { SnifferService } from './sniffer.service';

describe('SnifferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnifferService = TestBed.get(SnifferService);
    expect(service).toBeTruthy();
  });
});
