import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

const { selectKlAuthState } = authFeature;

const session = createSelector(selectKlAuthState, state => state.session);

const sessionLoaded = createSelector(session, session => !session.user.anonym);

const user = createSelector(selectKlAuthState, state => state.session.user);

const isAuthorized = createSelector(user, user => {
    return user.roles.filter(r => 'KL_ADMIN' === r).length > 0;
});

export const fromAuth = {
    session,
    sessionLoaded,
    user,
    isAuthorized,
};
