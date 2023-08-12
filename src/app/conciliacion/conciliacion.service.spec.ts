import { TestBed, inject } from '@angular/core/testing';

import { ConciliacionService } from './conciliacion.service';

describe('ConciliacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConciliacionService]
    });
  });

  it('should be created', inject([ConciliacionService], (service: ConciliacionService) => {
    expect(service).toBeTruthy();
  }));
});