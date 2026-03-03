import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ControlsComponent } from "./components/controls/controls.component";
import { StatsComponent } from "./components/stats/stats.component";
import { ScheduledSong } from '../models/song.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { SongCardGroupComponent } from "./components/song-card-group/song-card-group.component";

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [ControlsComponent, StatsComponent, CommonModule, SongCardGroupComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit, OnDestroy {
  songs: ScheduledSong[] = [];
  allSongs: ScheduledSong[] = [];
  dateOptions: string[] = [];
  dataLoaded = false;
  private routeSub?: Subscription;
  private searchTerm = '';
  private dateTerm = '';

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data as any;
    if (data && data.songs) {
      // initialize cache and filters with snapshot data
      this.onRefresh(data.songs);
    }
    this.routeSub = this.route
      .data.subscribe({
        next: (data) => {
          if (data?.['songs']?.length > 0) {
            this.onRefresh(data['songs']);
          } else {
            this.songs = [];
            this.allSongs = [];
            this.updateDateOptions();
            this.dataLoaded = true;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onRefresh(songs: ScheduledSong[]): void {
    this.allSongs = songs || [];
    this.updateDateOptions();
    this.applyFilters();
    this.dataLoaded = true;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onDate(val: string): void {
    this.dateTerm = val;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.allSongs;
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        (s.songName ?? '').toString().toLowerCase().includes(t)
      );
    }
    if (this.dateTerm) {
      // dateTerm is already formatted Spanish label
      filtered = filtered.filter(s => {
        const songDate: any = s.date;
        const formatted = songDate ? this.dataService.formatDateSpanish(songDate) : '';
        return formatted === this.dateTerm;
      });
    }
    this.songs = filtered;
  }

  private updateDateOptions(): void {
    const set = new Set<string>();
    this.allSongs.forEach(s => {
      const dateObj = s.date;
      if (dateObj) {
        set.add(this.dataService.formatDateSpanish(dateObj));
      }
    });
    // Sort dates chronologically
    this.dateOptions = Array.from(set).sort((a, b) => {
      const dateA = this.dataService.parseDate(a); // parse back from formatted string
      const dateB = this.dataService.parseDate(b);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });
  }

  getSongsWithChords(): number {
    return this.songs.filter(s => s.chordsOrLyrics).length;
  }

  getSongsWithVideo(): number {
    return this.songs.filter(s => s.youtube).length;
  }
}
