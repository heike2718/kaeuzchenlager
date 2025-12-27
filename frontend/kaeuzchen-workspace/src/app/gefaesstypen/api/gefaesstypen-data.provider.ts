import { GefaesstypenEffects, gefaesstypenFeature } from '@gefaesstypen/data';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const gefaesstypenDataProvider = [provideState(gefaesstypenFeature), provideEffects(GefaesstypenEffects)];
