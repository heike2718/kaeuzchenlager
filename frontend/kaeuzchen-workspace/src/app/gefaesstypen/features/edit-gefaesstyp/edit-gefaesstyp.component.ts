import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subject, takeUntil, tap } from 'rxjs';
import { Gefaesstyp, TEMP_UUID_PREFIX } from '@gefaesstypen/model';

@Component({
    selector: 'kl-edit-gefaesstyp.component',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
        MatButtonModule,
        MatGridListModule,
        MatInputModule,
        MatFormFieldModule,
    ],
    templateUrl: './edit-gefaesstyp.component.html',
    styleUrl: './edit-gefaesstyp.component.scss',
})
export class EditGefaesstypComponent implements OnInit, OnDestroy {
    facade = inject(GefaesstypenFacade);
    title = '';
    form!: FormGroup;
    #route = inject(ActivatedRoute);
    #fb: FormBuilder = inject(FormBuilder);
    readonly #destroy$ = new Subject<void>();

    constructor() {
        this.form = this.#fb.nonNullable.group({
            name: this.#fb.control<string>('', { nonNullable: true }),
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

                // Formular befüllen
                this.form.reset({
                    name: gefaesstyp.daten.name,
                    backgroundColor: gefaesstyp.daten.backgroundColor,
                    volumen: gefaesstyp.daten.volumen,
                    anzahl: gefaesstyp.daten.anzahl,
                });
            });
    }

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
}
