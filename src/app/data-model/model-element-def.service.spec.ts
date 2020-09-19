import { TestBed } from '@angular/core/testing';

import { ModelElementDefService } from './model-element-def.service';

describe('ModelElementDefService', () => {
  let service: ModelElementDefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelElementDefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
