import { TestBed } from '@angular/core/testing';

import { ModelElementDataService } from './model-element-data.service';

describe('ModelElementDataService', () => {
  let service: ModelElementDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelElementDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
