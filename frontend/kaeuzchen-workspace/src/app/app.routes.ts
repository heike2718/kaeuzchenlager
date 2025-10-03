import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GaefaesstypenList } from '@gefaesstypen/features/gefaesstypen-list';

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'gefaesstypen',
    component: GaefaesstypenList,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];
