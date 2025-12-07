import { Component, inject, OnInit } from '@angular/core';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { GefaesstypOverviewComponent } from '../gefaesstyp-overview/gefaesstyp-overview.component';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Gefaesstyp } from '@gefaesstypen/model';

@Component({
    selector: 'kl-gefaesstypen-list',
    imports: [GefaesstypOverviewComponent, AsyncPipe, MatIconModule, MatButtonModule],
    templateUrl: './gefaesstypen-list.component.html',
    styleUrl: './gefaesstypen-list.component.scss',
})
export class GefaesstypenListComponent implements OnInit {
    gefaesstypenFacade = inject(GefaesstypenFacade);

    ngOnInit(): void {
        this.gefaesstypenFacade.loadGefaesstypen();
    }

    onEditGefaesstyp(gefaesstyp: Gefaesstyp): void {
        this.gefaesstypenFacade.ensureGefaesstypenLoadedAndSelect(gefaesstyp.uuid);
    }

    onAddGefaesstyp(): void {
        this.gefaesstypenFacade.initNewGefaesstyp();
    }

    onDeleteGefaesstyp(gefaesstyp: Gefaesstyp) {
        this.gefaesstypenFacade.removeGefaesstyp(gefaesstyp.uuid);
    }
}
