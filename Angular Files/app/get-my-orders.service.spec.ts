import { TestBed } from '@angular/core/testing';

import { GetMyOrdersService } from './get-my-orders.service';

describe('GetMyOrdersService', () => {
  let service: GetMyOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMyOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
