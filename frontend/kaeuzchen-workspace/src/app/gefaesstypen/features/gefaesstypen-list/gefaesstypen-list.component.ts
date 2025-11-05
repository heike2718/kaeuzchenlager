import { Component, inject, OnInit } from '@angular/core';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { GefaesstypOverviewComponent } from '../gefaesstyp-overview/gefaesstyp-overview.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'kl-gefaesstypen-list',
  imports: [GefaesstypOverviewComponent, AsyncPipe],
  templateUrl: './gefaesstypen-list.component.html',
  styleUrl: './gefaesstypen-list.component.scss',
})
export class GefaesstypenListComponent implements OnInit {
  gefaesstypenFacade = inject(GefaesstypenFacade);

  ngOnInit(): void {
    this.gefaesstypenFacade.loadGefaesstypen();
  }
}
