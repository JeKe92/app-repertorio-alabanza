import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  
  getLocalStorageGroup(): string {
    try {
      return window.localStorage.getItem('grupo_alabanza') || '';
    } catch (e) {
      return '';
    }
  }

  getLocalStorageTheme(): string {
    try {
      return window.localStorage.getItem('repertorio_theme') || '';
    } catch (e) {
      return '';
    }
  }
}
