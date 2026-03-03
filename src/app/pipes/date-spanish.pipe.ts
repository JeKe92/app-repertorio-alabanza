import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../services/data.service';

@Pipe({ name: 'dateSpanish', standalone: true })
export class DateSpanishPipe implements PipeTransform {
  constructor(private dataService: DataService) {}

  transform(value: Date | null | undefined): string {
    return value ? this.dataService.formatDateSpanish(value) : '';
  }
}
