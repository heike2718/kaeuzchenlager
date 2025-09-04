import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Output } from "@angular/core";
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterLinkWithHref } from '@angular/router';
import { map, shareReplay } from "rxjs";;
import { ThemeStore } from "../theme.store";

@Component({
    selector: 'kl-navbar',
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterLinkWithHref
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    version = "1.0.0-SNAPSHOT"; 
    readonly theme = inject(ThemeStore);

    @Output()
    sidenavToggle = new EventEmitter();

    #breakpointObserver = inject(BreakpointObserver);
    #router = inject(Router);

    isHandset$ = this.#breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    onToggleSidenav(): void {
        this.sidenavToggle.emit();
    }

    onToggleTheme() { this.theme.toggle(); }

    onMenuItemClick(id: number): void {
        this.#router.navigate(['/home', id]);
    }
}