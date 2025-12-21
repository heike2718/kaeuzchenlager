import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthResult, LOGGED_OUT_REASON, Session } from '@shared/auth/model';

export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        bootstrapAuth: emptyProps(),
        logIn: emptyProps(),
        requestLoginUrl: emptyProps(),
        redirectToAuth: props<{ authUrl: string }>(),
        initSession: props<{ authResult: AuthResult }>(),
        reloadSession: emptyProps(),
        sessionLoaded: props<{ session: Session }>(),
        reloadSessionFailed: props<{ reason: LOGGED_OUT_REASON }>(),
        logOut: emptyProps(),
        loggedOut: props<{ reason: LOGGED_OUT_REASON }>(),
    },
});
