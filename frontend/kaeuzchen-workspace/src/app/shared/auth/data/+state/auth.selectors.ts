import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

const { selectKlAuthState } = authFeature;

const session = createSelector(selectKlAuthState, state => state.session);

const user = createSelector(selectKlAuthState, state => state.session.user);

export const fromAuth = {
    session,
    user,
};
