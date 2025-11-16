import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditGefaesstypComponent } from './edit-gefaesstyp.component';
import { GefaesstypenFacade } from '@gefaesstypen/api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('EditGefaesstypComponent', () => {
    let component: EditGefaesstypComponent;
    let fixture: ComponentFixture<EditGefaesstypComponent>;
    const activatedRouteStub: Partial<ActivatedRoute> = {
        paramMap: of(convertToParamMap({ uuid: '1234' })),
    };

    let gefaesstypenFacadeMock = {
        loadGefaesstypen: vi.fn(),
        selectGefaesstyp: vi.fn(),
    };

    beforeEach(async () => {
        gefaesstypenFacadeMock = {
            loadGefaesstypen: vi.fn(),
            selectGefaesstyp: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditGefaesstypComponent],
            providers: [
                { provide: GefaesstypenFacade, useValue: gefaesstypenFacadeMock },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditGefaesstypComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
