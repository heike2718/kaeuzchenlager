import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap } from 'rxjs';
import { fromAuth, authActions } from '@shared/auth/data';
import { anonymousSession, AuthResult, User } from '@shared/auth/model';
import { filterDefined } from '@shared/utils';
import { MessageService } from '@core/services';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    #store = inject(Store);
    #messageService = inject(MessageService);
    #currentSession = anonymousSession;

    readonly user$: Observable<User> = this.#store.select(fromAuth.user).pipe(filterDefined);

    readonly isUserLoggedIn$: Observable<boolean> = this.#store
        .select(fromAuth.user)
        .pipe(switchMap(user => of(!user.anonym)));

    readonly isUserLoggedOut$: Observable<boolean> = this.isUserLoggedIn$.pipe(switchMap(li => of(!li)));

    constructor() {
        this.#store.select(fromAuth.session).subscribe(session => {
            this.#currentSession = { ...session };
        });
    }

    login(): void {
        // Dies triggert einen SideEffect (siehe auth.effects.ts)
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    initClearOrRestoreSession(): void {
        const hash = window.location.hash;

        if (hash && hash.indexOf('idToken') > 0) {
            this.#initSession(hash);
        } else {
            this.#reloadSession();
        }
    }

    logout(): void {
        this.#store.dispatch(authActions.logOut());
    }

    handleSessionExpired(): void {
        this.#store.dispatch(authActions.loggedOut());
        this.#messageService.warn('Die Session ist abgelaufen. Bitte erneut einloggen.');
    }

    #parseHash(hash: string): AuthResult {
        hash = hash.replace(/^#?\/?/, '');

        const result: AuthResult = {
            expiresAt: 0,
            nonce: undefined,
            state: undefined,
            idToken: undefined,
        };

        if (hash.length > 0) {
            const tokens = hash.split('&');
            tokens.forEach(token => {
                const keyVal = token.split('=');
                switch (keyVal[0]) {
                    case 'expiresAt':
                        result.expiresAt = JSON.parse(keyVal[1]);
                        break;
                    case 'nonce':
                        result.nonce = keyVal[1];
                        break;
                    case 'state':
                        result.state = keyVal[1];
                        break;
                    case 'idToken':
                        result.idToken = keyVal[1];
                        break;
                }
            });
        }
        window.location.hash = '';
        return result;
    }

    #initSession(hash: string) {
        const authResult: AuthResult = this.#parseHash(hash);

        if (authResult.state) {
            if (authResult.state === 'login') {
                this.#store.dispatch(authActions.initSession({ authResult }));
            }
        } else {
            window.location.hash = '';
        }
    }

    #reloadSession() {
        if (this.#currentSession.sessionActive) {
            if (Date.now() > this.#currentSession.expiresAt) {
                this.logout();
            }
        }
    }
}
