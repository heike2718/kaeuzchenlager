import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { gefaesstypenDataProvider } from '@gefaesstypen/api';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ThemeStore } from './layout/theme.store';
import { KL_CONFIGURATION, configuration } from '@config';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
    withXsrfConfiguration,
} from '@angular/common/http';
import { KaeuzchenlagerAPIInterceptor } from './core/interceptors/kaeuzchenlager-api.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { authDataProvider } from '@shared/auth/api';

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
        authDataProvider,
        ...getEnvironmentSpecificProviders(),
        ThemeStore,
        provideHttpClient(
            withInterceptorsFromDi(),
            withXsrfConfiguration({
                cookieName: 'XSRF-TOKEN',
                headerName: 'X-XSRF-TOKEN',
            })
        ),
        { provide: KL_CONFIGURATION, useValue: configuration },
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: KaeuzchenlagerAPIInterceptor },
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: LoadingInterceptor },
    ],
};
