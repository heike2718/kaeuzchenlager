import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GefaesstypOverviewComponent } from './gefaesstyp-overview.component';
import { firstGefaesstyp } from '@testing';

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
});
