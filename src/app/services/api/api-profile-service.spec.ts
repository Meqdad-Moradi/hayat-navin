import '@angular/compiler';
import {
  HttpBackend,
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injector } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { User } from '../../models/user-model';
import { ApiProfileService } from './api-profile-service';

const testUser: User = {
  id: 'user-1',
  firstName: 'Taylor',
  lastName: 'Morgan',
  username: 'taylor-m',
  email: 'taylor@example.com',
  password: 'not-used-in-profile',
  roles: ['admin'],
  isActive: true,
};

class RecordingBackend implements HttpBackend {
  public readonly requests: HttpRequest<unknown>[] = [];
  public responseBody: unknown = testUser;

  public handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    this.requests.push(request);
    return of(new HttpResponse({ body: this.responseBody }));
  }
}

describe('ProfileService', () => {
  let service: ApiProfileService;
  let backend: RecordingBackend;

  beforeEach(() => {
    backend = new RecordingBackend();
    const injector = Injector.create({
      providers: [ApiProfileService, { provide: HttpClient, useValue: new HttpClient(backend) }],
    });
    service = injector.get(ApiProfileService);
  });

  it('loads the user matching the supplied email', async () => {
    backend.responseBody = [testUser];
    const result = await firstValueFrom(service.getUserByEmail(testUser.email));
    const request = backend.requests[0];

    expect(request.method).toBe('GET');
    expect(request.url).toBe('api/users');
    expect(request.params.get('email')).toBe(testUser.email);
    expect(result).toEqual(testUser);
  });

  it('returns null when there is no matching user', async () => {
    backend.responseBody = [];

    await expect(firstValueFrom(service.getUserByEmail('missing@example.com'))).resolves.toBeNull();
  });

  it('patches only the editable profile fields for the selected user', async () => {
    const profile = {
      firstName: 'Updated',
      lastName: 'Name',
      username: 'updated-name',
      email: 'updated@example.com',
    };

    const result = await firstValueFrom(service.updateUser(testUser.id, profile));
    const request = backend.requests[0];

    expect(request.method).toBe('PATCH');
    expect(request.url).toBe('api/users/user-1');
    expect(request.body).toEqual(profile);
    expect(result).toEqual(testUser);
  });
});
