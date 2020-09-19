import { TestBed } from '@angular/core/testing';

import { MathModelDefService } from './math-model-def.service';

describe('MathModelDefService', () => {
  let service: MathModelDefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MathModelDefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
