import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme: Theme = 'light';

  init() {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'light';
    this.setTheme(saved);
  }

  toggle() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  get current() {
    return this.theme;
  }

  private setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);

    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
  }
}
