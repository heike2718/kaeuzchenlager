import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthFacade } from '@shared/auth/api';
import { map, shareReplay } from 'rxjs';

@Component({
    selector: 'kl-home',
    imports: [MatButtonModule, AsyncPipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    #router = inject(Router);
    #breakpointObserver = inject(BreakpointObserver);

    authFacade = inject(AuthFacade);

    isHandset$ = this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches),
        shareReplay()
    );

    login(): void {
        this.authFacade.login();
    }

    logout(): void {
        this.authFacade.logout();
    }

    goToGefaesstypen(): void {
        this.#router.navigateByUrl('/gefaesstypen');
    }
}
