import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const THEME_KEY = 'repertorio_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  constructor(private localStorage: LocalStorageService) {}

  init(): void {
    let saved = this.localStorage.get(THEME_KEY);
    if (!saved) {
      saved = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    this.apply(saved);
  }

  toggle(): void {
    const current = document.body.classList.contains('light') ? 'light' : 'dark';
    this.apply(current === 'light' ? 'dark' : 'light');
  }

  apply(theme: string): void {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('light');
    }
    this.localStorage.set(THEME_KEY, theme);
  }

  get isDark(): boolean {
    return !document.body.classList.contains('light');
  }
}
