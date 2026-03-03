import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ControlsComponent } from "./components/controls/controls.component";
import { StatsComponent } from "./components/stats/stats.component";
import { ScheduledSong } from '../models/song.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { SongCardGroupComponent } from "./components/song-card-group/song-card-group.component";
import { filterSongs, getDateOptions, countWithChords, countWithVideo } from '../utils/song.utils';

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
      this.onRefresh(data.songs);
    }
    this.routeSub = this.route.data.subscribe({
      next: (data) => {
        if (data?.['songs']?.length > 0) {
          this.onRefresh(data['songs']);
        } else {
          this.songs = [];
          this.allSongs = [];
          this.dateOptions = [];
          this.dataLoaded = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onRefresh(songs: ScheduledSong[]): void {
    this.dataLoaded = false;
    this.allSongs = songs || [];
    this.dateOptions = getDateOptions(this.allSongs, d => this.dataService.formatDateSpanish(d));
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
    this.songs = filterSongs(
      this.allSongs,
      this.searchTerm,
      this.dateTerm,
      d => this.dataService.formatDateSpanish(d)
    );
  }

  getSongsWithChords(): number {
    return countWithChords(this.songs);
  }

  getSongsWithVideo(): number {
    return countWithVideo(this.songs);
  }
}
