import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, map, Subscription, take, tap } from 'rxjs';
import { TEMP_UUID_PREFIX } from '@gefaesstypen/model';

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

    #route = inject(ActivatedRoute);

    #subscriptions: Subscription = new Subscription();

    title = '';

    ngOnInit(): void {
        const activatedRoute$ = this.#route.paramMap.pipe(
            map(params => params.get('uuid')),
            filter((uuid): uuid is string => uuid !== null),
            tap(uuid => this.facade.ensureGefaesstypenLoadedAndSelect(uuid))
        );

        const sub = combineLatest([activatedRoute$, this.facade.selectedGefaesstyp$])
            .pipe(take(1))
            .subscribe(([, selectedGefaesstyp]) => {
                if (selectedGefaesstyp.uuid.startsWith(TEMP_UUID_PREFIX)) {
                    this.title = 'neuer Gefäßtyp';
                } else {
                    this.title = 'Gefäßtyp ändern';
                }
            });

        this.#subscriptions.add(sub);
    }

    ngOnDestroy(): void {
        this.#subscriptions.unsubscribe();
    }
}
