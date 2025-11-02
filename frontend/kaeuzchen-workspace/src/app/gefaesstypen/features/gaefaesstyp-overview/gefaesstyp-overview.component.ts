import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DEFAULT_GEFAESSTYP_BG_COLOR, Gefaesstyp } from '@gefaesstypen/model';

@Component({
  selector: 'kl-gefaesstyp-overview',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './gefaesstyp-overview.component.html',
  styleUrl: './gefaesstyp-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GefaesstypOverviewComponent {
  #gefaesstyp: Gefaesstyp | null = null;

  @Input({ required: false })
  set gefaesstyp(value: Gefaesstyp | null) {
    this.#gefaesstyp = value;
    this.#updateView();
  }
  get gefaesstyp(): Gefaesstyp | null {
    return this.#gefaesstyp;
  }

  // Bindings fürs Template
  backgroundColor = '#ffffff';
  isDarkBackground = false;
  ariaLabel = '';

  #updateView(): void {
    const g = this.#gefaesstyp;
    if (!g) {
      this.backgroundColor = '#ffffff';
      this.isDarkBackground = false;
      this.ariaLabel = '';
      return;
    }

    const hex = g.daten.backgroundColor ?? DEFAULT_GEFAESSTYP_BG_COLOR;
    this.backgroundColor = this.#normalizeHex(hex) ?? DEFAULT_GEFAESSTYP_BG_COLOR;
    this.isDarkBackground = this.#isColorDark(this.backgroundColor);

    // Einheit konsistent halten: hier Liter (Länge passt zur Anzeige)
    this.ariaLabel = `${g.daten.name}, Volumen: ${g.daten.volumen} Milliliter, Anzahl: ${g.daten.anzahl}`;
  }

  // #RGB → #RRGGBB, validiert grob
  #normalizeHex(hex: string): string | null {
    const h = hex.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(h)) {
      return ('#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2]).toLowerCase();
    }
    if (/^[0-9a-fA-F]{6}$/.test(h)) {
      return ('#' + h).toLowerCase();
    }
    return null;
  }

  // YIQ-Helligkeit
  #isColorDark(hexColor: string): boolean {
    const h = hexColor.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
  }
}
