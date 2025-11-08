import { Component, inject } from '@angular/core';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
export class EditGefaesstypComponent {
    gefaesstypenFacade = inject(GefaesstypenFacade);
}
