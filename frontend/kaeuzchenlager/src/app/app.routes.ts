import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GefaesseComponent } from './gefaesse/gefaesse.component';

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'gefaesse',
        component: GefaesseComponent
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
