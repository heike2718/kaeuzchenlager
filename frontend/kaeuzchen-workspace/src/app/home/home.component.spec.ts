import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo with correct attributes', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(logo).toBeTruthy();
    expect(logo.src).toContain('assets/images/kl-logo.svg');
    expect(logo.alt).toBe('Käuzchenlager Logo');
    expect(logo.getAttribute('role')).toBe('img');
    expect(logo.classList.contains('logo-image')).toBe(true); // Korrigiert
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hier ist das Käuzchenlager');
  });
});
