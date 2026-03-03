import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';
import { ScheduledSong } from '../models/song.model';
import { GROUP_LINKS } from '../constants/groups';

@Injectable({ providedIn: 'root' })
export class SheetResolver implements Resolve<ScheduledSong[]> {
  constructor(
    private dataService: DataService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScheduledSong[]> {
    const group = this.localStorageService.get('grupo_alabanza');
    if (!group || !GROUP_LINKS[group]) {
      this.router.navigate(['/elegir-grupo']);
      return of([]);
    }

    this.dataService.setSpreadsheet(GROUP_LINKS[group].link, GROUP_LINKS[group].sheet);

    const sheetParam = route.data?.['sheet'] as string | undefined;
    return this.dataService.getPublicSheetData(sheetParam).pipe(
      catchError(err => {
        console.error('SheetResolver: error loading sheet', err);
        return of([]);
      })
    );
  }
}
