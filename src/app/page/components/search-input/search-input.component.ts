import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
  @Output() searchChange = new EventEmitter<string>();

  onInput(e: Event): void {
    this.searchChange.emit((e.target as HTMLInputElement).value || '');
  }
}
