import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SongCardComponent } from '../song-card/song-card.component';
import { CommonModule } from '@angular/common';
import { ScheduledSong } from '../../../models/song.model';
import { DataService } from '../../../services/data.service';

interface SongGroup {
  label: string;
  list: ScheduledSong[];
}

@Component({
  selector: 'app-song-card-group',
  standalone: true,
  imports: [SongCardComponent, CommonModule],
  templateUrl: './song-card-group.component.html',
  styleUrl: './song-card-group.component.css'
})
export class SongCardGroupComponent implements OnChanges {
  @Input() songs: ScheduledSong[] = [];
  songsByDate: SongGroup[] = [];

  constructor(
    private dataService: DataService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songs']) {
      this.songsByDate = this.groupSongs(this.songs);
    }
  }

  /**
   * Group songs by their date (dateText) with Spanish formatting
   */
  private groupSongs(songs: ScheduledSong[]): SongGroup[] {
    const map = new Map<string, ScheduledSong[]>();
    const dateMap = new Map<string, Date>(); // Store parsed dates for sorting

    songs.forEach(song => {
      const dateObj = song.date;
      const key = dateObj ? this.dataService.formatDateSpanish(dateObj) : 'Sin fecha';
      if (!map.has(key)) {
        map.set(key, []);
        if (dateObj) dateMap.set(key, dateObj);
      }
      map.get(key)!.push(song);
    });

    // Convert to array and sort by date
    const groups: SongGroup[] = Array.from(map.entries()).map(([dateLabel, list]) => ({
      label: dateLabel,
      list
    }));

    groups.sort((a, b) => {
      const dateA = dateMap.get(a.label);
      const dateB = dateMap.get(b.label);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime(); // Descending order (newest first)
    });

    return groups;
  }
}
