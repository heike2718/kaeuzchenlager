import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_GEFAESSTYP_BG_COLOR, Gefaesstyp } from '@gefaesstypen/model';
import { ColorFormatError, normalizeHex, isColorDark } from '@shared/utils';

@Component({
    selector: 'kl-gefaesstyp-overview',
    standalone: true,
    imports: [MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: './gefaesstyp-overview.component.html',
    styleUrl: './gefaesstyp-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GefaesstypOverviewComponent {
    #gefaesstyp: Gefaesstyp;

    @Input({ required: false })
    set gefaesstyp(value: Gefaesstyp) {
        this.#gefaesstyp = value;
        this.#updateView();
    }
    get gefaesstyp(): Gefaesstyp {
        return this.#gefaesstyp;
    }

    @Output()
    edit = new EventEmitter<Gefaesstyp>();

    @Output()
    delete = new EventEmitter<Gefaesstyp>();

    backgroundColor = '#ffffff';
    isDarkBackground = false;
    ariaLabel = '';

    #updateView(): void {
        const g = this.#gefaesstyp;

        try {
            this.backgroundColor = normalizeHex(g.daten.backgroundColor);
            this.isDarkBackground = isColorDark(this.backgroundColor);
        } catch (e) {
            if (e instanceof ColorFormatError) {
                this.backgroundColor = DEFAULT_GEFAESSTYP_BG_COLOR;
                this.isDarkBackground = false;
            } else {
                throw e;
            }
        }

        // Einheit konsistent halten: hier Liter (Länge passt zur Anzeige)
        this.ariaLabel = `${g.daten.name}, Volumen: ${g.daten.volumen} Milliliter, Anzahl: ${g.daten.anzahl}`;
    }

    onEdit(): void {
        this.edit.emit(this.#gefaesstyp);
    }

    onDelete(): void {
        this.delete.emit(this.gefaesstyp);
    }
}
