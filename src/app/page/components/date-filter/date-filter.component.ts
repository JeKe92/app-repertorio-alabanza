import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.css'
})
export class DateFilterComponent {
  @Input() dateOptions: string[] = [];
  @Output() dateChange = new EventEmitter<string>();

  onChange(e: Event): void {
    this.dateChange.emit((e.target as HTMLSelectElement).value || '');
  }
}
