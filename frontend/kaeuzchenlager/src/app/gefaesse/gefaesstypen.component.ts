import { Component, inject, OnInit } from "@angular/core";
import { GefaesstypenStore } from "./gefaesstypen.store";


@Component({
    selector: 'kl-gefaesse',
    imports: [],
    templateUrl: './gefaesse.component.html',
    styleUrl: './gefaesse.component.scss'
})
export class GefaesseComponent implements OnInit {

    readonly gefaesstypenStore = inject(GefaesstypenStore)

    ngOnInit(): void {

        this.gefaesstypenStore.loadGefaesstypen();
        
    }

}
