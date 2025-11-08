import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    public getRouteGefaesstypenList(): string {
        return 'gefaesstypen';
    }

    public getRouteGefaesstypEditor(): string {
        return 'gefaesstypen/editor';
    }
}
