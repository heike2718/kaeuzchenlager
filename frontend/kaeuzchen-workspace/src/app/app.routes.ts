import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GefaesstypenList } from '@gefaesstypen/features/gefaesstypen-list';

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'gefaesstypen',
    component: GefaesstypenList,
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
