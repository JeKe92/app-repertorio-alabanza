import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { GROUP_LINKS, GROUPS } from '../../constants/groups';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

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

  constructor(private dataService: DataService) {}

  onPlaceChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (value) {
      window.localStorage.setItem('grupo_alabanza', value);
      this.dataService.setSpreadsheet(GROUP_LINKS[value].link, GROUP_LINKS[value].sheet);
    }
    this.value = value;
  }

  onAccept(): void {
    if (this.value) {
      this.router.navigate(['/repertorio']);
    }
  }
}
