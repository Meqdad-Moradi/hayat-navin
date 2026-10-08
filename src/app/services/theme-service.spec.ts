import '@angular/compiler';
import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { ThemeService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    const injector = Injector.create({
      providers: [ThemeService, { provide: DOCUMENT, useValue: document }],
    });
    service = injector.get(ThemeService);
  });

  it('starts with the light theme', () => {
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);
  });

  it('sets the dark theme attribute and switches back to light', () => {
    const root = document.documentElement;

    service.setTheme('dark');

    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(root.getAttribute('data-theme')).toBe('dark');

    service.setTheme('light');

    expect(service.theme()).toBe('light');
    expect(root.getAttribute('data-theme')).toBe('light');
  });

  it('toggles between light and dark themes', () => {
    service.toggleTheme();
    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });
});
