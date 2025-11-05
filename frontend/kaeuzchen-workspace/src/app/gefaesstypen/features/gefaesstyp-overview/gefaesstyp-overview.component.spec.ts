import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GefaesstypOverviewComponent } from './gefaesstyp-overview.component';
import { firstGefaesstyp, secondGefaesstyp } from '@testing';
import { By } from '@angular/platform-browser';
import { Gefaesstyp } from '@gefaesstypen/model';

describe('GefaesstypOverviewComponent', () => {
  let component: GefaesstypOverviewComponent;
  let fixture: ComponentFixture<GefaesstypOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GefaesstypOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GefaesstypOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Input setzen, dann rendern
    fixture.componentRef.setInput('gefaesstyp', firstGefaesstyp);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('rendert den card-title korrekt', () => {
    // Input setzen, dann rendern
    fixture.componentRef.setInput('gefaesstyp', firstGefaesstyp);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('mat-card-title') as HTMLElement;

    expect(title).toBeTruthy();
    expect(title.textContent?.trim()).toBe('Erster Gefäßtyp');
  });

  it('rendert die Farben des ersten Gefäßtyps korrekt', () => {
    fixture.componentRef.setInput('gefaesstyp', firstGefaesstyp);
    fixture.detectChanges();

    const card: HTMLElement = fixture.debugElement.query(By.css('mat-card')).nativeElement;
    expect(card.style.backgroundColor).toBe('rgb(255, 0, 102)');

    expect(card.classList).toContain('dark-background');
  });

  it('rendert die Farben des zweiten Gefäßtyps korrekt', () => {
    fixture.componentRef.setInput('gefaesstyp', secondGefaesstyp);
    fixture.detectChanges();

    const card: HTMLElement = fixture.debugElement.query(By.css('mat-card')).nativeElement;
    expect(card.style.backgroundColor).toBe('rgb(204, 255, 204)');

    expect(card.classList).not.toContain('dark-background');
  });

  it('ist robust gegen hex-errors', () => {
    const gefaesstyp: Gefaesstyp = {
      ...secondGefaesstyp,
      daten: { ...secondGefaesstyp.daten, backgroundColor: 'hallo' },
    };
    fixture.componentRef.setInput('gefaesstyp', gefaesstyp);
    fixture.detectChanges();

    const card: HTMLElement = fixture.debugElement.query(By.css('mat-card')).nativeElement;
    expect(card.style.backgroundColor).toBe('rgb(255, 255, 255)');

    expect(card.classList).not.toContain('dark-background');
  });

  it('rendert das grid korrekt', () => {
    fixture.componentRef.setInput('gefaesstyp', firstGefaesstyp);
    fixture.detectChanges();

    const cardContent: HTMLElement = findCardContent(fixture);
    expect(cardContent).toBeDefined();

    const classAttribute = cardContent.getAttribute('class');
    expect(classAttribute).toContain('content-grid');

    const gridRows: HTMLCollectionOf<Element> = cardContent.getElementsByClassName('grid-row');
    expect(gridRows.length).toBe(2);

    const ersteGridRow = gridRows[0];
    const spanElements1: HTMLCollectionOf<Element> = ersteGridRow.getElementsByTagName('span');
    expect(spanElements1.length).toBe(2);

    const spanElement11 = spanElements1[0];
    expect(spanElement11.getAttribute('class')).toContain('label');
    expect(spanElement11.textContent.trim()).toBe('Volumen:');

    const spanElement12 = spanElements1[1];
    expect(spanElement12.getAttribute('class')).toContain('value');
    expect(spanElement12.textContent.trim()).toBe('5 ml');

    const zweiteGridRow = gridRows[1];
    const spanElements2: HTMLCollectionOf<Element> = zweiteGridRow.getElementsByTagName('span');
    expect(spanElements2.length).toBe(2);
  });
});

function findCardContent(fixture: ComponentFixture<GefaesstypOverviewComponent>): HTMLElement {
  const cardContent = fixture.nativeElement.querySelector('mat-card-content') as HTMLElement;

  if (!cardContent) {
    throw new Error('No mat-card-content found');
  }

  return cardContent;
}
