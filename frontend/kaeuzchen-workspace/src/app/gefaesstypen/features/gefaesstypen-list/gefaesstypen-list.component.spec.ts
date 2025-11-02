import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GefaesstypenListComponent } from './gefaesstypen-list.component';
import { GefaesstypenFacade } from '../../api/gefaesstypen.facade';
import { BehaviorSubject } from 'rxjs';
import { Gefaesstyp } from '@gefaesstypen/model';

describe('GefaesstypenListComponent', () => {
  let component: GefaesstypenListComponent;
  let fixture: ComponentFixture<GefaesstypenListComponent>;

  const gefaesstypenSubject = new BehaviorSubject<Gefaesstyp[]>([]);
  const loadedSubject = new BehaviorSubject<boolean>(false);

  const gefaesstypenFacadeMock = {
    loadGefaesstypen: vi.fn(),
    selectGefaesstyp: vi.fn(),
    gefaesstypen$: gefaesstypenSubject.asObservable(),
    gefaesstypenLoaded$: loadedSubject.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GefaesstypenListComponent],
      providers: [{ provide: GefaesstypenFacade, useValue: gefaesstypenFacadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GefaesstypenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
