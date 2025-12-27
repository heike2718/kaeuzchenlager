import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { fromAuth, authActions } from '@shared/auth/data';
import { AuthResult, User } from '@shared/auth/model';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    #store = inject(Store);

    readonly sessionLoaded$: Observable<boolean> = this.#store.select(fromAuth.sessionLoaded);

    readonly user$: Observable<User> = this.#store.select(fromAuth.user);

    readonly isAuthorized$: Observable<boolean> = this.#store.select(fromAuth.isAuthorized);

    readonly isNotAuthorized$ = this.isAuthorized$.pipe(map(v => !v));

    readonly isUserLoggedIn$ = this.#store.select(fromAuth.user).pipe(map(user => !user.anonym));

    readonly isUserLoggedOut$ = this.isUserLoggedIn$.pipe(map(v => !v));

    login(): void {
        // Dies triggert einen SideEffect (siehe auth.effects.ts)
        this.#store.dispatch(authActions.requestLoginUrl());
    }

    initClearOrRestoreSession(): void {
        const hash = window.location.hash;

        if (hash && hash.indexOf('idToken') > 0) {
            this.#initSession(hash);
        } else {
            this.reloadSession();
        }
    }

    reloadSession(): void {
        this.#store.dispatch(authActions.reloadSession());
    }

    logout(): void {
        this.#store.dispatch(authActions.logOut());
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
}
