import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditGefaesstypComponent } from './edit-gefaesstyp.component';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Gefaesstyp } from '@gefaesstypen/model';
import { firstGefaesstyp, neuerGefaesstyp } from '@testing';

describe('EditGefaesstypComponent', () => {
    let component: EditGefaesstypComponent;
    let fixture: ComponentFixture<EditGefaesstypComponent>;
    let activatedRouteStub: Partial<ActivatedRoute>;

    let gefaesstypenFacadeMock: {
        selectedGefaesstyp$: Observable<Gefaesstyp | null>;
        ensureGefaesstypenLoadedAndSelect: ReturnType<typeof vi.fn>;
        isGefaesstypNichtEindeutig: ReturnType<typeof vi.fn>;
        saveGefaesstyp: ReturnType<typeof vi.fn>;
        cancelEditGefaesstyp: ReturnType<typeof vi.fn>;
    };

    function createComponent(): void {
        fixture = TestBed.createComponent(EditGefaesstypComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    beforeEach(async () => {
        gefaesstypenFacadeMock = {
            selectedGefaesstyp$: of(firstGefaesstyp),
            ensureGefaesstypenLoadedAndSelect: vi.fn(),
            isGefaesstypNichtEindeutig: vi.fn(() => false),
            saveGefaesstyp: vi.fn(),
            cancelEditGefaesstyp: vi.fn(),
        };

        // kann in Tests überschrieben werden
        activatedRouteStub = {
            paramMap: of(convertToParamMap({ uuid: '1234' })),
        };

        gefaesstypenFacadeMock.selectedGefaesstyp$ = of(firstGefaesstyp);

        await TestBed.configureTestingModule({
            imports: [EditGefaesstypComponent],
            providers: [
                { provide: GefaesstypenFacade, useValue: gefaesstypenFacadeMock },
                { provide: ActivatedRoute, useFactory: () => activatedRouteStub },
            ],
        }).compileComponents();
    });

    describe('create component', () => {
        it('creates and sets the title when existing gefaesstyp', () => {
            activatedRouteStub = {
                paramMap: of(convertToParamMap({ uuid: firstGefaesstyp.uuid })),
            };
            gefaesstypenFacadeMock.selectedGefaesstyp$ = of(firstGefaesstyp);

            createComponent();

            expect(component).toBeTruthy();
            expect(gefaesstypenFacadeMock.ensureGefaesstypenLoadedAndSelect).toHaveBeenCalledWith(firstGefaesstyp.uuid);
            expect(component.title).toBe('Gefäßtyp ändern');
        });

        it('creates and sets the title when new gefaesstyp', () => {
            const gefaesstyp = { ...neuerGefaesstyp, uuid: 'temp-1234' };

            activatedRouteStub = {
                paramMap: of(convertToParamMap({ uuid: gefaesstyp.uuid })),
            };
            gefaesstypenFacadeMock.selectedGefaesstyp$ = of(gefaesstyp);

            createComponent();

            expect(component).toBeTruthy();
            expect(gefaesstypenFacadeMock.ensureGefaesstypenLoadedAndSelect).toHaveBeenCalledWith('temp-1234');
            expect(component.title).toBe('neuer Gefäßtyp');
        });

        it('shows error message when name and volumen already exist for a new gefaesstyp', () => {
            const neuerTyp = { ...neuerGefaesstyp, uuid: 'temp-1234' };

            activatedRouteStub = {
                paramMap: of(convertToParamMap({ uuid: neuerTyp.uuid })),
            };

            gefaesstypenFacadeMock.selectedGefaesstyp$ = of(neuerTyp);
            gefaesstypenFacadeMock.isGefaesstypNichtEindeutig.mockReturnValue(true);

            createComponent();

            component.form.patchValue({
                name: 'Vase',
                volumen: 500,
                farbe: 'blau',
                anzahl: 3,
            });

            component.form.get('name')?.markAsDirty();
            component.form.get('volumen')?.markAsDirty();
            component.form.updateValueAndValidity();
            fixture.detectChanges();

            expect(gefaesstypenFacadeMock.isGefaesstypNichtEindeutig).toHaveBeenCalled();
            expect(component.form.hasError('gefaesstypNichtEindeutig')).toBe(true);

            const compiled = fixture.nativeElement as HTMLElement;
            const errorEl = compiled.querySelector('.gt-editor__error--duplicate') as HTMLElement;

            expect(errorEl).not.toBeNull();
            expect(errorEl.textContent).toContain('Diese Kombination aus Name und Volumen existiert bereits.');

            const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
            expect(button.disabled).toBe(true);
        });
    });
});
