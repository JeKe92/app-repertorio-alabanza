import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-actions.component.html',
  styleUrl: './song-actions.component.css'
})
export class SongActionsComponent {
  @Input() chordsUrl?: string;
  @Input() youtubeUrl?: string;
}
