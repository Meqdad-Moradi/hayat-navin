import { DOCUMENT } from '@angular/common';
import { computed, inject, Service, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Service()
export class ThemeService {
  private readonly themeKey = 'theme';

  private readonly document = inject(DOCUMENT);

  private readonly currentTheme = signal<Theme>(this.getThemeFromLocalStorage() || 'dark');
  readonly theme = this.currentTheme.asReadonly();
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    const storedTheme = this.getThemeFromLocalStorage();
    this.applyTheme(storedTheme || 'dark');
  }

  /**
   * toggleTheme
   */
  public toggleTheme(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  /**
   * setTheme
   * @param theme Theme
   */
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
  }

  /**
   * applyTheme
   * @param theme Theme
   */
  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeKey, theme);
  }

  /**
   * getThemeFromLocalStorage
   * @returns Theme | null
   */
  private getThemeFromLocalStorage(): Theme | null {
    return (localStorage.getItem(this.themeKey) as Theme) ?? null;
  }
}
