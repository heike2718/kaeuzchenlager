import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthResult, Session } from '@shared/auth/model';

export const authActions = createActionGroup({
    source: 'Auth',
    events: {
        logIn: emptyProps(),
        requestLoginUrl: emptyProps(),
        redirectToAuth: props<{ authUrl: string }>(),
        initSession: props<{ authResult: AuthResult }>(),
        sessionCreated: props<{ session: Session }>(),
        logOut: emptyProps(),
        loggedOut: emptyProps(),
    },
});
