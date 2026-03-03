import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { GROUP_LINKS, GROUPS } from '../../constants/groups';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-choose-place',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-place.component.html',
  styleUrl: './choose-place.component.css'
})
export class ChoosePlaceComponent {
  private router = inject(Router);
  readonly GROUPS = GROUPS;
  value = '';

  constructor(
    private dataService: DataService,
    private localStorageService: LocalStorageService
  ) {}

  onPlaceChange(event: Event): void {
    this.value = (event.target as HTMLSelectElement).value;
    if (this.value) {
      this.localStorageService.set('grupo_alabanza', this.value);
    }
  }

  onAccept(): void {
    if (this.value) {
      this.dataService.setSpreadsheet(GROUP_LINKS[this.value].link, GROUP_LINKS[this.value].sheet);
      this.router.navigate(['/repertorio']);
    }
  }
}
