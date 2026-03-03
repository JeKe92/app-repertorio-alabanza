import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { SheetResolver } from './services/sheet-resolver.service';
import { ChoosePlaceComponent } from './page/choose-place/choose-place.component';

export const routes: Routes = [
  {
    path: 'repertorio',
    component: PageComponent,
    resolve: { songs: SheetResolver },
    data: { sheet: 'ProgMes' }
  },
  {
    path:'elegir-grupo',
    component: ChoosePlaceComponent
  },
  {
    path: '',
    redirectTo: '/repertorio',
    pathMatch: 'full'
  }
];
