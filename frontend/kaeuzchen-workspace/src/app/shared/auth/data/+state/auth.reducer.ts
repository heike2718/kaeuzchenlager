import { createFeature, createReducer, on } from '@ngrx/store';
import { anonymousSession, AUTH_FEATURE_KEY, Session } from '@shared/auth/model';
import { authActions } from './auth.actions';

export interface AuthState {
    readonly session: Session;
    readonly sessionLoaded: boolean;
}

export const initialState: AuthState = {
    session: anonymousSession,
    sessionLoaded: false,
};

export const authFeature = createFeature({
    name: AUTH_FEATURE_KEY,
    reducer: createReducer<AuthState>(
        initialState,
        on(authActions.sessionLoaded, (state, action) => {
            return { ...state, session: action.session, sessionLoaded: true };
        }),
        on(authActions.reloadSessionFailed, state => {
            return { ...state, session: { ...state.session, user: anonymousSession.user }, sessionLoaded: true };
        }),
        on(authActions.loggedOut, state => {
            return {
                ...state,
                session: anonymousSession,
                sessionLoaded: false,
            };
        })
    ),
});
