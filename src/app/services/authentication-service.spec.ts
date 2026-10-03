import '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { AuthenticationService } from './authentication-service';
import { ErrorsService } from './errors-service';
import { User } from '../models/user-model';

const testUser: User = {
  id: 'user-1',
  firstName: 'Test',
  lastName: 'User',
  username: 'test-user',
  email: 'test@example.com',
  password: '',
  roles: [],
  isActive: true,
};

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    service = createService();
    expect(service).toBeTruthy();
  });

  it('should not restore a user when no session token exists', () => {
    sessionStorage.setItem('me', JSON.stringify(testUser));

    service = createService();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(sessionStorage.getItem('me')).toBeNull();
  });

  it('should restore a user when a session token exists', () => {
    sessionStorage.setItem('me', JSON.stringify(testUser));
    sessionStorage.setItem('refresh_token', 'refresh-token');

    service = createService();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual(testUser);
  });

  it('should clear authentication state on logout', () => {
    sessionStorage.setItem('me', JSON.stringify(testUser));
    sessionStorage.setItem('access_token', 'access-token');

    service = createService();

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });
});

function createService(): AuthenticationService {
  const injector = Injector.create({
    providers: [
      AuthenticationService,
      { provide: HttpClient, useValue: {} },
      { provide: ErrorsService, useValue: {} },
    ],
  });

  return injector.get(AuthenticationService);
}
