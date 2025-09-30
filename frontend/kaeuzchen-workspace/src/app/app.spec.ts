import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { of } from 'rxjs';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, HomeComponent, RouterModule.forRoot([{ path: '', component: HomeComponent }])],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });

  it('should sidenav closed initially', async () => {
    const sidenavHarness = await loader.getHarness(MatSidenavHarness);
    expect(sidenavHarness).toBeDefined();

    const isOpen = await sidenavHarness.isOpen();
    expect(isOpen).toBe(false);
  });

  it('opens the sidenav when Navbar emits sidenavToggle (handset) and closes it when Sidenav emits sidenavClose', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const sidenav = await loader.getHarness(MatSidenavHarness);

    // initial geschlossen
    expect(await sidenav.isOpen()).toBe(false);

    // Handset-Zweig aktivieren, damit der Burger-Button gerendert wird
    const navbarDe = fixture.debugElement.query(By.directive(NavbarComponent));
    navbarDe.componentInstance.isHandset$ = of(true);
    fixture.detectChanges();

    // Hamburger-Button klicken
    const burgerBtn = navbarDe.query(By.css('button[mat-icon-button]'))
      .nativeElement as HTMLButtonElement;
    burgerBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Erwartung: sidenav ist offen (toggle wurde verdrahtet)
    expect(await sidenav.isOpen()).toBe(true);

    // 2) sidenavClose emittieren und prüfen, ob sidenav geschlossen wird
    const sidenavDe = fixture.debugElement.query(By.directive(SidenavComponent));
    sidenavDe.componentInstance.sidenavClose.emit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(await sidenav.isOpen()).toBe(false);
  });
});
