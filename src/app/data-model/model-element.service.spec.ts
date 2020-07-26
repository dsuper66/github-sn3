import { TestBed } from '@angular/core/testing';

import { ModelElementService } from './model-element.service';

describe('ModelElementService', () => {
  let service: ModelElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
