import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledSong } from '../../../models/song.model';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.css'
})
export class SongCardComponent {

  @Input() song: ScheduledSong | null = null;

}
