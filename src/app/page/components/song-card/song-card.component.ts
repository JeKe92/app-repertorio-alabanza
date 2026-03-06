import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledSong } from '../../../models/song.model';
import { SongActionsComponent } from '../song-actions/song-actions.component';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, SongActionsComponent],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.css'
})
export class SongCardComponent {
  @Input() song: ScheduledSong | null = null;

  get isPast(): boolean {
    if (!this.song?.date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.song.date < today;
  }
}
