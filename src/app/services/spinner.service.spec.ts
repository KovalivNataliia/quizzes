import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass true value in subject on show method', (done: DoneFn) => {
    service.showSpinner.subscribe(value => {
      expect(value).toBeTrue();
      done();
    })
    service.show();
  });

  it('should pass false value in subject on hide method', (done: DoneFn) => {
    service.showSpinner.subscribe(value => {
      expect(value).toBeFalse();
      done();
    })
    service.hide();
  });
});
