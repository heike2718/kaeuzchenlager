import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { gefaesstypenDataProvider } from '@gefaesstypen/api';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ThemeStore } from './layout/theme.store';
import { KL_CONFIGURATION, configuration } from '@config';

// Environment-spezifische Provider
function getEnvironmentSpecificProviders() {
    const providers = [];

    if (!configuration.production) {
        providers.push(
            provideStoreDevtools({
                maxAge: 25,
                connectInZone: true,
                logOnly: false,
            })
        );
    }

    return providers;
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideStore({}),
        provideEffects(),
        gefaesstypenDataProvider,
        ...getEnvironmentSpecificProviders(),
        ThemeStore,
        { provide: KL_CONFIGURATION, useValue: configuration },
    ],
};
