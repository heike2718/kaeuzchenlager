import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GefaesstypenListComponent } from '@gefaesstypen/features/gefaesstypen-list';
import { EditGefaesstypComponent } from '@gefaesstypen/features/edit-gefaesstyp';
import { authorizedGuard } from '@shared/auth/api';

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'gefaesstypen',
        canActivateChild: [authorizedGuard('KL_ADMIN')],
        children: [
            { path: '', component: GefaesstypenListComponent },
            { path: ':uuid', component: EditGefaesstypComponent },
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
