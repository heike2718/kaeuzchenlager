import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthHttpService } from '../auth-http.service';
import { authActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AppMessage } from '@core/model';
import { Session } from '@shared/auth/model';

@Injectable({
    providedIn: 'root',
})
export class AuthEffects {
    #actions = inject(Actions);
    #router = inject(Router);
    #authHttpService = inject(AuthHttpService);

    requestLoginUrl$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.requestLoginUrl),
            switchMap(() => this.#authHttpService.getLoginUrl()),
            map((message: AppMessage) => authActions.redirectToAuth({ authUrl: message.text }))
        );
    });

    redirectToAuth$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.redirectToAuth),
                switchMap(action => of(action.authUrl)),
                tap(authUrl => {
                    console.log(authUrl);
                    window.location.href = authUrl;
                })
            ),
        { dispatch: false }
    );

    createSession$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.initSession),
            switchMap(({ authResult }) => this.#authHttpService.createSession(authResult)),
            map((session: Session) => authActions.sessionCreated({ session }))
        );
    });

    logOut$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.logOut),
            switchMap(() => this.#authHttpService.logOut()),
            map(() => authActions.loggedOut()),
            catchError(() => of(authActions.loggedOut()))
        );
    });

    loggedOut$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.loggedOut),
                tap(() => this.#router.navigateByUrl('/'))
            ),
        { dispatch: false }
    );
}
