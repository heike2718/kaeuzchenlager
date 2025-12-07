import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subject, takeUntil, tap } from 'rxjs';
import { Gefaesstyp, GefaesstypDaten, NAME_PATTERN, TEMP_UUID_PREFIX } from '@gefaesstypen/model';
import { MatIconModule } from '@angular/material/icon';
import { TrimOnBlurDirective } from '@shared/directives';

@Component({
    selector: 'kl-edit-gefaesstyp.component',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
        MatButtonModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        TrimOnBlurDirective,
    ],
    templateUrl: './edit-gefaesstyp.component.html',
    styleUrl: './edit-gefaesstyp.component.scss',
})
export class EditGefaesstypComponent implements OnInit, OnDestroy, AfterViewInit {
    facade = inject(GefaesstypenFacade);
    title = '';
    form!: FormGroup;

    #route = inject(ActivatedRoute);
    #fb: FormBuilder = inject(FormBuilder);
    #currentUuid = '';

    @ViewChild('nameInput', { read: MatInput }) nameInput!: MatInput;
    @ViewChild('volumenInput', { read: MatInput }) volumenInput!: MatInput;

    nameNichtEindeutig = false;
    volumenNichtEindeutig = false;

    readonly #destroy$ = new Subject<void>();

    constructor() {
        this.form = this.#fb.nonNullable.group({
            name: this.#fb.control<string>('', {
                nonNullable: true,
                validators: [Validators.required, Validators.pattern(NAME_PATTERN)],
            }),
            backgroundColor: this.#fb.control<string>('#ffffff', { nonNullable: true }),
            volumen: this.#fb.control<number>(0),
            anzahl: this.#fb.control<number>(0),
        });
    }

    ngOnInit(): void {
        this.#route.paramMap
            .pipe(
                map(params => params.get('uuid')),
                filter((uuid): uuid is string => uuid !== null),
                tap(uuid => this.facade.ensureGefaesstypenLoadedAndSelect(uuid)),
                takeUntil(this.#destroy$)
            )
            .subscribe();

        this.facade.selectedGefaesstyp$
            .pipe(
                filter((gt): gt is Gefaesstyp => gt !== null),
                takeUntil(this.#destroy$)
            )
            .subscribe(gefaesstyp => {
                // Titel setzen
                this.title = gefaesstyp.uuid.startsWith(TEMP_UUID_PREFIX) ? 'neuer Gefäßtyp' : 'Gefäßtyp ändern';
                this.#currentUuid = gefaesstyp.uuid;

                // Formular befüllen
                this.form.reset({
                    name: gefaesstyp.daten.name,
                    backgroundColor: gefaesstyp.daten.backgroundColor,
                    volumen: gefaesstyp.daten.volumen,
                    anzahl: gefaesstyp.daten.anzahl,
                });
            });
    }

    ngAfterViewInit(): void {
        queueMicrotask(() => this.nameInput.focus());
    }

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    get anzahlIsMin(): boolean {
        const value = this.form.controls['anzahl'].value ?? 0;
        return value <= 0;
    }

    incrementAnzahl(): void {
        const current = this.form.controls['anzahl'].value ?? 0;
        this.form.controls['anzahl'].setValue(current + 1);
    }

    decrementAnzahl(): void {
        const current = this.form.controls['anzahl'].value ?? 0;
        if (current > 0) {
            this.form.controls['anzahl'].setValue(current - 1);
        }
    }

    onSubmit(): void {
        const daten: GefaesstypDaten = this.#createGefaesstypDaten();
        const gefaesstyp: Gefaesstyp = {
            uuid: this.#currentUuid,
            daten: daten,
        };
        this.facade.saveGefaesstyp(gefaesstyp);
    }

    onCancel(): void {
        this.facade.cancelEditGefaesstyp(this.#currentUuid);
    }

    onNameBlur(): void {
        const daten = this.#createGefaesstypDaten();
        if (!daten) {
            return;
        }

        const ctrl = this.form.controls.name;
        if (!ctrl) {
            return;
        }

        this.nameNichtEindeutig = this.facade.isNameNichtEindeutig(daten, this.#currentUuid);

        if (this.nameNichtEindeutig) {
            ctrl.setErrors({ ...(ctrl.errors ?? {}), notUnique: true });
            ctrl.markAsTouched();
            queueMicrotask(() => this.nameInput?.focus());
        } else {
            const errors = { ...(ctrl.errors ?? {}) };
            delete (errors as Record<string, unknown>).notUnique;
            ctrl.setErrors(Object.keys(errors).length ? errors : null);
        }
    }

    onVolumenBlur(): void {
        const daten = this.#createGefaesstypDaten();
        if (!daten) {
            return;
        }

        const ctrl = this.form.controls.volumen;
        if (!ctrl) {
            return;
        }

        this.volumenNichtEindeutig = this.facade.isVolumenNichtEindeutig(daten, this.#currentUuid);

        if (this.volumenNichtEindeutig) {
            ctrl.setErrors({ ...(ctrl.errors ?? {}), notUnique: true });
            ctrl.markAsTouched();
            queueMicrotask(() => this.volumenInput?.focus());
        } else {
            const errors = { ...(ctrl.errors ?? {}) };
            delete (errors as Record<string, unknown>).notUnique;
            ctrl.setErrors(Object.keys(errors).length ? errors : null);
        }
    }

    #createGefaesstypDaten(): GefaesstypDaten | null {
        if (!this.form) {
            return null;
        }

        const raw = this.form.getRawValue(); // liest alle Controls

        const name = (raw.name ?? '').trim();
        const volumen = raw.volumen ?? 0;
        const anzahl = raw.anzahl ?? 0;
        const backgroundColor = (raw.backgroundColor ?? '#ffffff').trim();

        if (!name) {
            return null; // oder du gibst es trotzdem weiter, je nach Strategie
        }

        return {
            name,
            volumen,
            anzahl,
            backgroundColor,
            version: null,
        };
    }
}
