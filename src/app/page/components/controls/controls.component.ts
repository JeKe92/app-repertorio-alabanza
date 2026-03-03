import { Component, OnInit, Output, EventEmitter, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { ScheduledSong } from '../../../models/song.model';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';
import { GROUPS } from '../../../constants/groups';
import { SearchInputComponent } from '../search-input/search-input.component';
import { DateFilterComponent } from '../date-filter/date-filter.component';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [SearchInputComponent, DateFilterComponent, RouterLink],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css'
})
export class ControlsComponent implements OnInit {

  @Output() refresh = new EventEmitter<ScheduledSong[]>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();
  @Input() dateOptions: string[] = [];

  groupName = '';
  private router = inject(Router);

  constructor(
    private dataService: DataService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const group = this.localStorageService.getLocalStorageGroup();
    if (!group) {
      this.router.navigate(['/elegir-grupo']);
      return;
    }
    const match = GROUPS.find(g => g[0] === group);
    this.groupName = match ? match[1] : '';
  }

  load(): void {
    this.dataService.loadData().pipe(take(1)).subscribe({
      next: songs => this.refresh.emit(songs as ScheduledSong[]),
      error: err => {
        console.error('ControlsComponent: error loading sheet', err);
        this.refresh.emit([]);
      }
    });
  }
}
