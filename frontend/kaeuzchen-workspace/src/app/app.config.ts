import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { gefaesstypenDataProvider } from '@gefaesstypen/api';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideStore({}),
        provideEffects(),
        gefaesstypenDataProvider,
    ],
};
