import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { SheetResolver } from './services/sheet-resolver.service';

export const routes: Routes = [
  { path: 'repertorio', component: PageComponent, resolve: { songs: SheetResolver }, data: { sheet: 'ProgMes' } }
];
