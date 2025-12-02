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

        const trimmed = value.trim();
        if (trimmed === value) {
            return;
        }

        // Wert im FormControl aktualisieren, aber keine neue valueChanges-Welle auslösen
        control.setValue(trimmed, { emitEvent: false });
        control.markAsDirty();
    }
}
