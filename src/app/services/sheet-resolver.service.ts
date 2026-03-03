import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { ScheduledSong } from '../models/song.model';

@Injectable({ providedIn: 'root' })
export class SheetResolver implements Resolve<ScheduledSong[]> {
  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScheduledSong[]> {
    const sheetParam = route.data && route.data['sheet'] ? route.data['sheet'] as string : undefined;
    return this.dataService.getPublicSheetData(sheetParam).pipe(
      catchError(err => {
        console.error('SheetResolver: error loading sheet', err);
        return of([]);
      })
    );
  }
}
