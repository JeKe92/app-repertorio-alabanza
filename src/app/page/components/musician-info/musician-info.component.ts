import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledSong } from '../../../models/song.model';

@Component({
  selector: 'app-musician-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './musician-info.component.html',
  styleUrl: './musician-info.component.css'
})
export class MusicianInfoComponent {
  @Input() song!: ScheduledSong;
}
