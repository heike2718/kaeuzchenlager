import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GefaesstypenListComponent } from '@gefaesstypen/features/gefaesstypen-list';

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'gefaesstypen',
    component: GefaesstypenListComponent,
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
