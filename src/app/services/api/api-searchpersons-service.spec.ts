import { TestBed } from '@angular/core/testing';
import { ApiSearchpersonsService } from './api-searchpersons-service';

describe('ApiSearchpersonsService', () => {
  let service: ApiSearchpersonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSearchpersonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
