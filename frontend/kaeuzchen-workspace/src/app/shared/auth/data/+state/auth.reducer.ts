import { createFeature, createReducer, on } from '@ngrx/store';
import { anonymousSession, AUTH_FEATURE_KEY, Session } from '@shared/auth/model';
import { authActions } from './auth.actions';

export interface AuthState {
    readonly session: Session;
    readonly sessionExists: boolean;
}

export const initialState: AuthState = {
    session: anonymousSession,
    sessionExists: false,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialState,
        on(authActions.sessionCreated, (state, { session: session }): AuthState => {
            return {
                ...state,
                session: session,
            };
        }),
        on(authActions.loggedOut, state => {
            return {
                ...state,
                session: anonymousSession,
            };
        })
    ),
});
