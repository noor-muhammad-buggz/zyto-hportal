import { TestBed, inject } from '@angular/core/testing';

import { ZytoClientWellnessService } from './zyto-client-wellness.service';

describe('ZytoClientWellnessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZytoClientWellnessService]
    });
  });

  it('should be created', inject([ZytoClientWellnessService], (service: ZytoClientWellnessService) => {
    expect(service).toBeTruthy();
  }));
});
