import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GefaesstypenListComponent } from './gefaesstypen-list.component';
import { GefaesstypenFacade } from '../../api/gefaesstypen.facade';
import { BehaviorSubject } from 'rxjs';
import { Gefaesstyp } from '@gefaesstypen/model';
import { firstGefaesstyp, secondGefaesstyp } from '@testing';

describe('GefaesstypenListComponent', () => {
  let component: GefaesstypenListComponent;
  let fixture: ComponentFixture<GefaesstypenListComponent>;

  let gefaesstypenSubject = new BehaviorSubject<Gefaesstyp[]>([]);
  let loadedSubject = new BehaviorSubject<boolean>(false);

  let gefaesstypenFacadeMock = {
    loadGefaesstypen: vi.fn(),
    selectGefaesstyp: vi.fn(),
    gefaesstypen$: gefaesstypenSubject.asObservable(),
    gefaesstypenLoaded$: loadedSubject.asObservable(),
  };

  beforeEach(async () => {
    // Subjects und Mock pro Test neu erstellen
    gefaesstypenSubject = new BehaviorSubject<Gefaesstyp[]>([]);
    loadedSubject = new BehaviorSubject<boolean>(false);

    gefaesstypenFacadeMock = {
      loadGefaesstypen: vi.fn(),
      selectGefaesstyp: vi.fn(),
      gefaesstypen$: gefaesstypenSubject.asObservable(),
      gefaesstypenLoaded$: loadedSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [GefaesstypenListComponent],
      providers: [{ provide: GefaesstypenFacade, useValue: gefaesstypenFacadeMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GefaesstypenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    gefaesstypenSubject.complete();
    loadedSubject.complete();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();

    fixture.detectChanges();
    await fixture.whenStable();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeDefined();
    expect(h1.textContent.trim()).toBe('Gefäßtypen');
    expect(gefaesstypenFacadeMock.loadGefaesstypen).toHaveBeenCalledTimes(1);
  });

  it('zeigt Ladezustand, solange gefaesstypen noch nicht geladen sind', async () => {
    fixture.detectChanges();

    await fixture.whenStable();

    const p = fixture.nativeElement.querySelector('p');
    expect(p).toBeDefined();
    expect(p.textContent.trim()).toBe('Lade Daten…');
    expect(fixture.nativeElement.querySelectorAll('kl-gefaesstyp-overview').length).toBe(0);
  });

  it('renders the child elements', async () => {
    loadedSubject.next(true);
    gefaesstypenSubject.next([firstGefaesstyp, secondGefaesstyp]);
    fixture.detectChanges();
    await fixture.whenStable();

    const childElements: HTMLElement[] =
      fixture.nativeElement.querySelectorAll('kl-gefaesstyp-overview');
    expect(childElements.length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('Lade Daten…');
    expect(fixture.nativeElement.querySelector('p')).toBeNull();
  });
});
