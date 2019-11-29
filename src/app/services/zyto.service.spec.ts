import { TestBed, inject } from '@angular/core/testing';

import { ZytoService } from './zyto.service';

describe('ZytoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZytoService]
    });
  });

  it('should be created', inject([ZytoService], (service: ZytoService) => {
    expect(service).toBeTruthy();
  }));
});
