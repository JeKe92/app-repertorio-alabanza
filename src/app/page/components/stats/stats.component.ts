import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  @Input() totalSongs = 0;
  @Input() withChords = 0;
  @Input() withVideo = 0;
}
