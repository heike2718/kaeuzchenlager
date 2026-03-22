import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[input[klTrimOnBlur], textarea[klTrimOnBlur]]',
})
export class TrimOnBlurDirective {
    #ngControl = inject(NgControl, { optional: true });

    @HostListener('blur')
    onBlur(): void {
        if (!this.#ngControl) {
            return;
        }

        const control = this.#ngControl.control;
        if (!control) {
            return;
        }

        const value = control.value;

        if (typeof value !== 'string') {
            return;
        }

        const normalized = value.trim().replace(/\s+/g, ' ');

        if (normalized === value) {
            return;
        }

        // Wert im FormControl aktualisieren, aber keine neue valueChanges-Welle auslösen
        control.setValue(normalized, { emitEvent: false });
        control.markAsDirty();
    }
}
