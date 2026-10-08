import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { AuthenticationService } from '../../../services/authentication-service';
import { ErrorsService } from '../../../services/errors-service';
import { ApiProfileService } from '../../../services/api/api-profile-service';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            getCurrentUserEmail: () => null,
            updateCurrentUserEmail: () => undefined,
          },
        },
        { provide: ErrorsService, useValue: { getErrorMessage: () => 'Request failed.' } },
        { provide: ApiProfileService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
