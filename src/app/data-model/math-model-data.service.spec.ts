import { TestBed } from '@angular/core/testing';

import { MathModelDataService } from './math-model-data.service';

describe('MathModelDataService', () => {
  let service: MathModelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathModelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
