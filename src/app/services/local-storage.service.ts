import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get(key: string): string {
    try { return window.localStorage.getItem(key) || ''; } catch { return ''; }
  }

  set(key: string, value: string): void {
    try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
  }

  remove(key: string): void {
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
  }

  getLocalStorageGroup(): string {
    return this.get('grupo_alabanza');
  }

  getLocalStorageTheme(): string {
    return this.get('repertorio_theme');
  }
}
