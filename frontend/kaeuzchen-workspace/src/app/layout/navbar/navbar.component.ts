import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ThemeStore } from '../theme.store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';

import { Router, RouterLinkWithHref } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { KL_CONFIGURATION, KLConfiguration } from '@config';
import { AuthFacade } from '@shared/auth/api';

@Component({
    selector: 'kl-navbar',
    imports: [
        MatMenuModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterLinkWithHref,
        AsyncPipe,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    readonly config: KLConfiguration = inject(KL_CONFIGURATION);
    readonly theme = inject(ThemeStore);

    @Output()
    sidenavToggle = new EventEmitter();

    authFacade = inject(AuthFacade);

    #breakpointObserver = inject(BreakpointObserver);
    #router = inject(Router);

    isHandset$ = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay()
    );

    onToggleSidenav(): void {
        this.sidenavToggle.emit();
    }

    onMenuItemClick(id: number): void {
        this.#router.navigate(['/home', id]);
    }

    login(): void {
        this.authFacade.login();
    }

    logout(): void {
        this.authFacade.logout();
    }
}
