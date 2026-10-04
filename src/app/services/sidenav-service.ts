import { Service, signal } from '@angular/core';

@Service()
export class SidenavService {
  public isSidenavOpen = signal(true);
}
