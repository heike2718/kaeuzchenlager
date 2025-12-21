import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthHttpService } from '../auth-http.service';
import { authActions } from './auth.actions';
import { catchError, delay, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AppMessage } from '@core/model';
import { Store } from '@ngrx/store';
import { Session } from '@shared/auth/model';
import { fromAuth } from './auth.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '@core/services';

@Injectable({
    providedIn: 'root',
})
export class AuthEffects {
    #store = inject(Store);
    #actions = inject(Actions);
    #router = inject(Router);
    #authHttpService = inject(AuthHttpService);
    #messageService = inject(MessageService);

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
                    window.location.href = authUrl;
                })
            ),
        { dispatch: false }
    );

    createSession$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.initSession),
            switchMap(({ authResult }) => this.#authHttpService.createSession(authResult)),
            map((session: Session) => authActions.sessionLoaded({ session }))
        );
    });

    reloadSession$ = createEffect(() =>
        this.#actions.pipe(
            ofType(authActions.reloadSession),
            withLatestFrom(this.#store.select(fromAuth.sessionLoaded)),
            filter(([, loaded]) => !loaded),
            exhaustMap(() =>
                this.#authHttpService.reloadSession().pipe(
                    map(session => authActions.sessionLoaded({ session })),
                    catchError((err: HttpErrorResponse) => {
                        if (err.status === 440) {
                            return of(authActions.reloadSessionFailed({ reason: 'expired' as const }));
                        }
                        if (err.status === 401) {
                            return of(authActions.reloadSessionFailed({ reason: 'unauthorized' as const }));
                        }
                        return of(authActions.reloadSessionFailed({ reason: 'technical' as const }));
                    })
                )
            )
        )
    );

    reloadSessionFailed$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.reloadSessionFailed),
                switchMap(action => of(action.reason)),
                tap(reason => {
                    if (reason === 'expired') {
                        this.#router.navigateByUrl('/home');
                        this.#messageService.warn('Ihre Session ist abgelaufen. Bitte loggen Sie sich erneut ein.');
                    }
                    if (reason === 'technical') {
                        this.#messageService.error(
                            'Ups, da ist ein unerwarteter Fehler aufgetreten. Wenden Sie sich bitte vertrauensvoll an Ihren technischen support.'
                        );
                    }
                    if (reason === 'unauthorized') {
                        this.#router.navigateByUrl('/home');
                    }
                })
            ),
        { dispatch: false }
    );

    logOut$ = createEffect(() => {
        return this.#actions.pipe(
            ofType(authActions.logOut),
            switchMap(() => this.#authHttpService.logOut()),
            map(() => authActions.loggedOut({ reason: 'useraction' })),
            catchError(() => of(authActions.loggedOut({ reason: 'useraction' })))
        );
    });

    loggedOut$ = createEffect(
        () =>
            this.#actions.pipe(
                ofType(authActions.loggedOut),
                tap(({ reason }) => {
                    if (reason === 'expired') {
                        this.#messageService.warn('Deine Session ist abgelaufen. Bitte logg Dich erneut ein.');
                    } else if (reason === 'technical') {
                        this.#messageService.error(
                            'Ups, da ist ein unerwarteter Fehler aufgetreten. Bitte wende Dich vertrauensvoll an Deinen technischen Support.'
                        );
                    }
                    // unauthorized: meist keine Message, nur "still" nach /home

                    // Navigation immer am Ende
                    delay(0);
                    this.#router.navigateByUrl('/home');
                })
            ),
        { dispatch: false }
    );
}
