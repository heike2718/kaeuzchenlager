import { InjectionToken } from '@angular/core';

export interface KLConfiguration {
    readonly production: boolean;
    readonly version: string;
    readonly environment: string;
    readonly apiUrl: string;
}

export const KL_CONFIGURATION = new InjectionToken<KLConfiguration>('kl-configuration');
