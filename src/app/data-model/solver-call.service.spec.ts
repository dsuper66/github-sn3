import { TestBed } from '@angular/core/testing';

import { SolverCallService } from './solver-call.service';

describe('SolverCallService', () => {
  let service: SolverCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolverCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
