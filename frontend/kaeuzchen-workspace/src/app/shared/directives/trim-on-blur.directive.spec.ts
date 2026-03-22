import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, NgControl } from '@angular/forms';
import { TrimOnBlurDirective } from './trim-on-blur.directive';

class MockNgControl extends NgControl {
    override control: AbstractControl | null;

    constructor(control: AbstractControl) {
        super();
        this.control = control;
    }

    // notwendig, aber hier nicht benutzt
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override viewToModelUpdate(_: unknown): void {}
}

describe('TrimOnBlurDirective', () => {
    function createDirectiveWithControl(control: AbstractControl): TrimOnBlurDirective {
        const mockNgControl = new MockNgControl(control);
        let directive!: TrimOnBlurDirective;

        TestBed.configureTestingModule({
            providers: [{ provide: NgControl, useValue: mockNgControl }],
        });

        TestBed.runInInjectionContext(() => {
            directive = new TrimOnBlurDirective();
        });

        return directive;
    }

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('trimmt den Wert bei blur', () => {
        const control = new FormControl<string>('   abc  ');
        const directive = createDirectiveWithControl(control);

        directive.onBlur();

        expect(control.value).toBe('abc');
    });

    it('trimmt entfernt mehr als ein inneres Leerzeichen bei blur', () => {
        const control = new FormControl<string>('   ab  c   de ');
        const directive = createDirectiveWithControl(control);

        directive.onBlur();

        expect(control.value).toBe('ab c de');
    });

    it('ändert nichts, wenn bereits getrimmt', () => {
        const control = new FormControl<string>('abc');
        const directive = createDirectiveWithControl(control);

        control.markAsPristine();
        directive.onBlur();

        expect(control.value).toBe('abc');
        expect(control.dirty).toBe(false);
    });

    it('macht nichts bei nicht-string-Wert', () => {
        const control = new FormControl<number | string>(123 as number);
        const directive = createDirectiveWithControl(control);

        directive.onBlur();

        expect(control.value).toBe(123);
    });

    // Optional: Verhalten ohne NgControl testen
    it('macht nichts, wenn kein NgControl injiziert werden kann', () => {
        let directive!: TrimOnBlurDirective;

        // kein NgControl-Provider
        TestBed.configureTestingModule({});

        TestBed.runInInjectionContext(() => {
            directive = new TrimOnBlurDirective();
        });

        // darf einfach nicht crashen
        directive.onBlur();
    });
});
