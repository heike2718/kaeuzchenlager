import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shell/layout/navbar/navbar.component';
import { SidenavComponent } from './shell/layout/sidenav/sidenav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  imports: [
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    NavbarComponent,
    SidenavComponent
  ],
  selector: 'kl-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'kaeuzchenlager';
}
