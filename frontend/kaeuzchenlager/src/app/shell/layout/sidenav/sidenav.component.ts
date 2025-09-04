import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLinkWithHref } from '@angular/router';
import { ThemeStore } from '../theme.store';

@Component({
    selector: 'kl-sidenav',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSidenavModule,
        RouterLinkWithHref
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  version = '1.0.0-SNAPSHOT';
  readonly theme = inject(ThemeStore);

  @Output()
  sidenavClose = new EventEmitter();

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  onToggleTheme() { this.theme.toggle(); }

}
