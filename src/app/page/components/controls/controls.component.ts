import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ScheduledSong } from '../../../models/song.model';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css'
})
export class ControlsComponent {

  @Output() refresh = new EventEmitter<ScheduledSong[]>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();
  @Input() dateOptions: string[] = [];
  
  private readonly THEME_KEY = 'repertorio_theme';
  @HostListener('window:click', ['$event'])
  onThemeToggleClick(event: Event) {
    if (event.target instanceof HTMLElement && event.target.id === 'theme-toggle') {
      this.toggleTheme();
    }
  }

  constructor(private dataService: DataService) { }

  initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(this.THEME_KEY); } catch (e) { /* ignore */ }
    if (!saved) {
      saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    this.applyTheme(saved);
  }

  applyTheme(theme: string) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('light');
    }
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (btn) {
      btn.title = (theme === 'light') ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
    }
    if (icon) {
      // use material icons names: light_mode / dark_mode
      icon.textContent = (theme === 'light') ? 'dark_mode' : 'light_mode';
    }
    try { localStorage.setItem(this.THEME_KEY, theme); } catch (e) { /* ignore */ }
  }

  toggleTheme() {
    const current = document.body.classList.contains('light') ? 'light' : 'dark';
    this.applyTheme(current === 'light' ? 'dark' : 'light');
  }

  /**
   * Load/refresh data from the configured public Google Sheet and emit results
   */
  load(): void {
    this.dataService.loadData().pipe(take(1)).subscribe(songs => {
      this.refresh.emit(songs as ScheduledSong[]);
    }, err => {
      console.error('ControlsComponent: error loading sheet', err);
      this.refresh.emit([]);
    });
  }

  /**
   * emit search term change
   */
  filterBySongName(e: Event): void {
    const term = (e.target as HTMLInputElement).value || '';
    this.searchChange.emit(term);
  }

  /**
   * emit date filter change
   */
  filterByDate(e: Event): void {
    const val = (e.target as HTMLSelectElement).value || '';
    this.dateChange.emit(val);
  }
}
