import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { of } from 'rxjs';
import { Router, RouterLink, RouterLinkWithHref, RouterModule, UrlTree } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { ThemeStore } from '../theme.store';
import { MatIcon } from '@angular/material/icon';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        HomeComponent,
        RouterModule.forRoot([{ path: '', component: HomeComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.version = '1.2.0'; // Setze die Version für den Test
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when not handset', () => {
    beforeEach(async () => {
      component.isHandset$ = of(false);
      fixture.detectChanges();
    });

    it('should render mat-toolbar element', () => {
      const toolbar = findMatToolbar(fixture);
      expect(toolbar).toBeTruthy();
    });

    it('should render router link Startseite - test with css', () => {
      const toolbar = findMatToolbar(fixture);
      const routerLink = toolbar.querySelector('a[routerLink="/home"]');
      expect(routerLink).toBeTruthy();
      expect(routerLink.getAttribute('href')).toBe('/home');
      expect(routerLink.tagName.toLowerCase()).toBe('a');
      expect(routerLink.getAttribute('mat-button')).not.toBeNull();

      const icons = routerLink.getElementsByTagName('mat-icon');
      expect(icons.length).toBe(1);

      const icon = icons[0] as HTMLElement;
      expect(icon.textContent);
      expect(icon.textContent.trim()).toBe('home');
      const classListOfIcon = icon.classList;
      expect(classListOfIcon).toContain('mat-icon');
      expect(classListOfIcon).toContain('nav-item');
      expect(icon.getAttribute('role')).toBe('img');
      expect(icon.getAttribute('aria-hidden')).toBe('true');

      const spanElements = routerLink.getElementsByTagName('span');
      expect(spanElements.length).toBe(1);
      const caption = spanElements[0] as HTMLElement;
      expect(caption.textContent.trim()).toBe('Startseite');
      expect(caption.classList).toContain('nav-caption');
    });

    it('renders the home router link as the FIRST item in the toolbar - test with DebugElement', async () => {
      // Arrange
      const toolbarDe = fixture.debugElement.query(By.css('mat-toolbar'));
      expect(toolbarDe).toBeDefined();

      // Alle RouterLinks innerhalb der Toolbar in DOM-Reihenfolge
      const linkDes: DebugElement[] = toolbarDe.queryAll(By.directive(RouterLink));
      expect(linkDes.length).toBeGreaterThan(0);

      // Wir wollen explizit den ERSTEN Link validieren (links außen)
      const firstLinkDe = linkDes[0];

      // 1) Strukturelle Strenge: es MUSS ein <a> bleiben (kein <button> etc.)
      const native = firstLinkDe.nativeElement as HTMLElement;
      expect(native.tagName).toBe('A'); // bricht, wenn später ein Button verwendet wird

      // 2) Ziel prüfen – bevorzugt über das gerenderte href-Attribut (roh, nicht absolut)
      const hrefAttr = (native as HTMLAnchorElement).getAttribute('href');
      expect(hrefAttr).toBe('/home');

      // 3) Optionaler Gegencheck über die Directive (robust gg. absolute URLs)
      const rl =
        firstLinkDe.injector.get(RouterLink, null) ??
        firstLinkDe.injector.get(RouterLinkWithHref, null);
      expect(rl).toBeTruthy();

      // Wenn du zusätzlich die „logische“ Zieldefinition prüfen willst (nicht nötig, aber möglich):
      // const reactiveHref = (rl as any)?.reactiveHref?.(); // Signal-Getter -> aufrufen!
      // if (typeof reactiveHref === 'string') {
      //   expect(reactiveHref).toBe('/home');
      // }

      // 4) Kinder prüfen: Icon + Caption innerhalb GENAU dieses Links
      const iconDe = firstLinkDe.query(By.css('mat-icon'));
      expect(iconDe).toBeTruthy();
      expect(iconDe.nativeElement.textContent.trim()).toBe('home');

      const captionDe = firstLinkDe.query(By.css('span.nav-caption'));
      expect(captionDe).toBeTruthy();
      expect(captionDe.nativeElement.textContent.trim()).toBe('Startseite');

      // 5) (A11y) Wenn das Icon dekorativ sein soll
      expect(iconDe.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('navigates to /home when clicking the Home link', async () => {
      const router = TestBed.inject(Router);
      const navSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

      const toolbarDe = fixture.debugElement.query(By.css('mat-toolbar'));
      const linkDe = toolbarDe.query(By.css('a[routerLink="/home"]'));
      (linkDe.nativeElement as HTMLAnchorElement).click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(navSpy).toHaveBeenCalledTimes(1);

      const [arg] = navSpy.mock.calls[0];
      expect(arg).toBeTruthy();

      const path =
        typeof arg === 'string'
          ? arg
          : arg instanceof UrlTree
          ? router.serializeUrl(arg)
          : (() => {
              throw new Error('Unexpected argument type');
            })();

      expect(path).toBe('/home');
    });

    it('renders the gefaesstypen router link as the SECOND item in the toolbar', async () => {
      // Arrange
      const toolbarDe = fixture.debugElement.query(By.css('mat-toolbar'));
      expect(toolbarDe).toBeDefined();

      // Alle RouterLinks innerhalb der Toolbar in DOM-Reihenfolge
      const linkDes: DebugElement[] = toolbarDe.queryAll(By.directive(RouterLink));
      expect(linkDes.length).toBeGreaterThan(0);

      // Wir wollen explizit den ZWEITEN Link validieren (links außen)
      const firstLinkDe = linkDes[1];

      // 1) Strukturelle Strenge: es MUSS ein <a> bleiben (kein <button> etc.)
      const native = firstLinkDe.nativeElement as HTMLElement;
      expect(native.tagName).toBe('A'); // bricht, wenn später ein Button verwendet wird

      // 2) Ziel prüfen – bevorzugt über das gerenderte href-Attribut (roh, nicht absolut)
      const hrefAttr = (native as HTMLAnchorElement).getAttribute('href');
      expect(hrefAttr).toBe('/gefaesstypen');

      // 3) Optionaler Gegencheck über die Directive (robust gg. absolute URLs)
      const rl =
        firstLinkDe.injector.get(RouterLink, null) ??
        firstLinkDe.injector.get(RouterLinkWithHref, null);
      expect(rl).toBeTruthy();

      // Wenn du zusätzlich die „logische“ Zieldefinition prüfen willst (nicht nötig, aber möglich):
      // const reactiveHref = (rl as any)?.reactiveHref?.(); // Signal-Getter -> aufrufen!
      // if (typeof reactiveHref === 'string') {
      //   expect(reactiveHref).toBe('/gefaesstypen');
      // }

      // 4) Kinder prüfen: Icon + Caption innerhalb GENAU dieses Links
      const iconDe = firstLinkDe.query(By.css('mat-icon'));
      expect(iconDe).toBeTruthy();
      expect(iconDe.nativeElement.textContent.trim()).toBe('liquor');

      const captionDe = firstLinkDe.query(By.css('span.nav-caption'));
      expect(captionDe).toBeTruthy();
      expect(captionDe.nativeElement.textContent.trim()).toBe('Gefäßtypen');

      // 5) (A11y) Wenn das Icon dekorativ sein soll
      expect(iconDe.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('navigates to /gefaesstypen when clicking the gefaesstypen link', async () => {
      const router = TestBed.inject(Router);
      const navSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

      const toolbarDe = fixture.debugElement.query(By.css('mat-toolbar'));
      const linkDe = toolbarDe.query(By.css('a[routerLink="/gefaesstypen"]'));
      (linkDe.nativeElement as HTMLAnchorElement).click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(navSpy).toHaveBeenCalledTimes(1);

      const [arg] = navSpy.mock.calls[0];
      expect(arg).toBeTruthy();

      const path =
        typeof arg === 'string'
          ? arg
          : arg instanceof UrlTree
          ? router.serializeUrl(arg)
          : (() => {
              throw new Error('Unexpected argument type');
            })();

      expect(path).toBe('/gefaesstypen');
    });

    it('should render a toolbar spacer', () => {
      const spacer = findToolbarSpacer(fixture);
      expect(spacer).toBeTruthy();
      expect(spacer.classList.contains('toolbar-spacer')).toBe(true);
    });

    it('should render begrüßungstext next right to toolbar spacer', () => {
      const spacer = findToolbarSpacer(fixture);
      const begruessung = spacer.nextElementSibling as HTMLElement;
      expect(begruessung).toBeTruthy();
      expect(begruessung.textContent.trim()).toContain('Moin, ');
      expect(begruessung.tagName.toLowerCase()).toBe('div');
      expect(begruessung.classList).toContain('mr-2');
    });

    it('should render version two right to toolbar spacer', () => {
      const expectedVersionText = `Version: 1.2.0`;

      const spacer = findToolbarSpacer(fixture);
      // spacer ist an dieser Stelle vorhanden, weil die function eine exception wirft, wenn nicht
      const begruessung = spacer.nextElementSibling as HTMLElement;
      expect(begruessung).toBeTruthy();
      expect(begruessung.textContent.trim()).toContain('Moin, ');

      // Version ist das zweite Element nach dem Spacer
      const version = begruessung.nextElementSibling as HTMLElement;
      expect(version).toBeTruthy();
      expect(version.textContent.trim()).toBe(expectedVersionText);
      expect(version.tagName.toLowerCase()).toBe('span');
      expect(version.classList).toContain('ml-2');
    });

    it('should render the theme toggle button', async () => {
      const allTooltips = await loader.getAllHarnesses(MatTooltipHarness);
      expect(allTooltips).toBeTruthy();
      expect(allTooltips.length).toBe(1);

      const tooltipHarness = await loader.getHarness(
        MatTooltipHarness.with({ selector: 'button.ml-2' })
      );
      expect(tooltipHarness).toBeTruthy();
      await tooltipHarness.show();
      const ttText = await tooltipHarness.getTooltipText();
      expect(ttText.trim()).toBe('umschalten');
    });

    it('toggles aria-label and label text when clicking the theme button - start with dark theme', async () => {
      const store = TestBed.inject(ThemeStore);
      const spy = vi.spyOn(store, 'toggle');

      const btn = await loader.getHarness(MatButtonHarness.with({ selector: 'button.ml-2' }));
      const host = await btn.host();

      // Initial: dark === true
      await fixture.whenStable();
      expect(await host.getAttribute('aria-label')).toBe('Auf helles Theme umschalten'); // aus dem Template
      expect((await btn.getText()).trim()).toContain('lieber light'); // sichtbarer Buttontext

      // Klick -> toggleTheme()
      await btn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(await host.getAttribute('aria-label')).toBe('Auf dunkles Theme umschalten');
      expect((await btn.getText()).trim()).toContain('lieber dark');

      // jetzt ist es light, nochmal klicken
      await btn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(await host.getAttribute('aria-label')).toBe('Auf helles Theme umschalten');
      expect((await btn.getText()).trim()).toContain('lieber light');
    });
  });

  describe('when handset', () => {
    beforeEach(async () => {
      component.isHandset$ = of(true);
      fixture.detectChanges();
    });

    it('should show hamburger menu button', async () => {
      const spy = vi.spyOn(component.sidenavToggle, 'emit');
      const toolbarDe = fixture.debugElement.query(By.css('mat-toolbar'));
      expect(toolbarDe).toBeTruthy();

      const buttonDe = toolbarDe.query(By.css('button[mat-icon-button]'));
      expect(buttonDe).toBeTruthy();

      const buttonEl = buttonDe.nativeElement as HTMLButtonElement;
      buttonEl.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalledTimes(1);

      // Alle MatIcons innerhalb der Toolbar in DOM-Reihenfolge
      const iconDes: DebugElement[] = toolbarDe.queryAll(By.directive(MatIcon));
      expect(iconDes.length).toBe(1);

      const menuIcon = iconDes[0].nativeElement as HTMLElement;
      expect(menuIcon.textContent.trim()).toBe('menu');
    });
  });
});

function findMatToolbar(fixture: ComponentFixture<NavbarComponent>): HTMLElement {
  const matToolbar = fixture.nativeElement.querySelector('mat-toolbar') as HTMLElement;

  if (!matToolbar) {
    throw new Error('No mat-toolbar found');
  }

  return matToolbar;
}

function findToolbarSpacer(fixture: ComponentFixture<NavbarComponent>): HTMLElement {
  const matToolbar = findMatToolbar(fixture);
  const toolbarSpacer = matToolbar.querySelector('.toolbar-spacer') as HTMLElement;

  if (!toolbarSpacer) {
    throw new Error('No toolbar spacer found');
  }

  return toolbarSpacer;
}
