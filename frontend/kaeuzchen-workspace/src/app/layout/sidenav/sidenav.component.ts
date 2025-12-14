import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLinkWithHref } from '@angular/router';
import { ThemeStore } from '../theme.store';
import { KL_CONFIGURATION, KLConfiguration } from '@config';
import { AuthFacade } from '@shared/auth/api';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'kl-sidenav',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSidenavModule,
        RouterLinkWithHref,
        AsyncPipe,
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
    readonly config: KLConfiguration = inject(KL_CONFIGURATION);
    readonly theme = inject(ThemeStore);
    authFacade = inject(AuthFacade);

    @Output()
    sidenavClose = new EventEmitter();

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    };

    public login(): void {
        this.authFacade.login();
    }

    public logout(): void {
        this.authFacade.logout();
    }
}
