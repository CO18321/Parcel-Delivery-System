import { TestBed } from '@angular/core/testing';

import { VerificationStatusGuard } from './verification-status.guard';

describe('VerificationStatusGuard', () => {
  let guard: VerificationStatusGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerificationStatusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
