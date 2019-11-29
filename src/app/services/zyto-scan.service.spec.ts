import { TestBed, inject } from '@angular/core/testing';

import { ZytoScanService } from './zyto-scan.service';

describe('ZytoClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZytoScanService]
    });
  });

  it('should be created', inject([ZytoScanService], (service: ZytoScanService) => {
    expect(service).toBeTruthy();
  }));
});
