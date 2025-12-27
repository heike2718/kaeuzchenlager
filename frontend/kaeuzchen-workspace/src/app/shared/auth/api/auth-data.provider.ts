import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { authFeature, AuthEffects } from '@shared/auth/data';

export const authDataProvider = [provideState(authFeature), provideEffects(AuthEffects)];

export * from '@shared/auth/data';
