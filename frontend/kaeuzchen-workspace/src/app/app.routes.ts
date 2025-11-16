import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GefaesstypenListComponent } from '@gefaesstypen/features/gefaesstypen-list';
import { EditGefaesstypComponent } from '@gefaesstypen/features/edit-gefaesstyp';

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'gefaesstypen',
        children: [
            {
                path: '',
                component: GefaesstypenListComponent, // /gefaesstypen
            },
            {
                path: ':uuid',
                component: EditGefaesstypComponent, // /gefaesstypen/:uuid
            },
        ],
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
