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
        selectedGefaesstyp$: Observable<Gefaesstyp>;
        ensureGefaesstypenLoadedAndSelect: (uuid: string) => void;
    };

    function createComponent(): void {
        fixture = TestBed.createComponent(EditGefaesstypComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    beforeEach(async () => {
        gefaesstypenFacadeMock = {
            selectedGefaesstyp$: of(), // wird im Test überschrieben
            ensureGefaesstypenLoadedAndSelect: vi.fn(),
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
        it('creates and sets the title when new gefaesstyp', () => {
            createComponent();

            expect(component).toBeTruthy();
            expect(gefaesstypenFacadeMock.ensureGefaesstypenLoadedAndSelect).toBeCalledTimes(1);
            expect(gefaesstypenFacadeMock.ensureGefaesstypenLoadedAndSelect).toBeCalledWith('1234');
            expect(component.title).toBe('Gefäßtyp ändern');
        });

        it('creates and sets the title when existing gefaesstyp', () => {
            const gefaesstyp = { ...neuerGefaesstyp, uuid: 'temp-1234' };

            // neuen Stub zuweisen – Property wird nicht geändert,
            // sondern das gesamte Objekt ersetzt
            activatedRouteStub = {
                paramMap: of(convertToParamMap({ uuid: gefaesstyp.uuid })),
            } as ActivatedRoute;

            // Fassade liefert synchron den passenden Gefäßtyp
            gefaesstypenFacadeMock.selectedGefaesstyp$ = of(gefaesstyp);

            createComponent();

            expect(component).toBeTruthy();
            expect(gefaesstypenFacadeMock.ensureGefaesstypenLoadedAndSelect).toBeCalledTimes(1);
            expect(gefaesstypenFacadeMock.ensureGefaesstypenLoadedAndSelect).toBeCalledWith('temp-1234');
            expect(component.title).toBe('neuer Gefäßtyp');
        });
    });
});
