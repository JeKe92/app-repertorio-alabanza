import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SongCardComponent } from '../song-card/song-card.component';
import { CommonModule } from '@angular/common';
import { ScheduledSong } from '../../../models/song.model';
import { DataService } from '../../../services/data.service';
import { MusicianInfoComponent } from '../musician-info/musician-info.component';

interface SongGroup {
  label: string;
  list: ScheduledSong[];
  isPast: boolean;
}

@Component({
  selector: 'app-song-card-group',
  standalone: true,
  imports: [SongCardComponent, CommonModule, MusicianInfoComponent],
  templateUrl: './song-card-group.component.html',
  styleUrl: './song-card-group.component.css'
})
export class SongCardGroupComponent implements OnChanges {
  @Input() songs: ScheduledSong[] = [];
  songsByDate: SongGroup[] = [];

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songs']) {
      this.songsByDate = this.groupSongs(this.songs);
    }
  }

  private groupSongs(songs: ScheduledSong[]): SongGroup[] {
    const map = new Map<string, ScheduledSong[]>();
    const dateMap = new Map<string, Date>();

    songs.forEach(song => {
      const dateObj = song.date;
      const key = dateObj ? this.dataService.formatDateSpanish(dateObj) : 'Sin fecha';
      if (!map.has(key)) {
        map.set(key, []);
        if (dateObj) dateMap.set(key, dateObj);
      }
      map.get(key)!.push(song);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groups: SongGroup[] = Array.from(map.entries()).map(([dateLabel, list]) => {
      const date = dateMap.get(dateLabel);
      return { label: dateLabel, list, isPast: date ? date < today : false };
    });

    groups.sort((a, b) => {
      const dateA = dateMap.get(a.label);
      const dateB = dateMap.get(b.label);
      if (!dateA || !dateB) return 0;
      const aPast = dateA < today;
      const bPast = dateB < today;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return dateA.getTime() - dateB.getTime();
    });

    return groups;
  }
}
