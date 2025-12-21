import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthFacade } from './auth.facade';

export const authorizedGuard =
    (requiredRole: string): CanActivateFn =>
    () => {
        const auth = inject(AuthFacade);
        const router = inject(Router);

        // F5
        auth.reloadSession();

        return auth.sessionLoaded$.pipe(
            filter(Boolean),
            take(1),
            switchMap(() => auth.user$.pipe(take(1))),
            map(user => (user.roles.includes(requiredRole) ? true : router.createUrlTree(['/home'])))
        );
    };
