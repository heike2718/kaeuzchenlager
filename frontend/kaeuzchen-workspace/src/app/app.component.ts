import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { LoadingIndicatorComponent, MessageComponent } from '@shared/components';
import { AuthFacade } from '@shared/auth/api';

@Component({
    imports: [
        MatToolbarModule,
        MatSidenavModule,
        NavbarComponent,
        SidenavComponent,
        RouterModule,
        MessageComponent,
        LoadingIndicatorComponent,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    #authFacade = inject(AuthFacade);

    ngOnInit(): void {
        this.#authFacade.initClearOrRestoreSession();
    }
}
