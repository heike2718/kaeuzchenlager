import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { HomeComponent } from '../../home/home.component';
import { Router, RouterLink, RouterLinkWithHref, RouterModule, UrlTree } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { ThemeStore } from '../theme.store';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidenavComponent, HomeComponent, RouterModule.forRoot([{ path: '', component: HomeComponent }])],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        component.version = '1.2.0'; // Setze die Version für den Test
        fixture.detectChanges();
    });

    it('should create and be closed', async () => {
        expect(component).toBeTruthy();
    });

    it('renders a mat-nav-list', () => {
        const matNavList = findMatNavList(fixture);
        expect(matNavList).toBeDefined();
    });

    it('renders two dividers', () => {
        const matNavList = findMatNavList(fixture);

        const dividers = matNavList.querySelectorAll('mat-divider');
        expect(dividers.length).toBe(2); // bricht, wenn später mehr Divider hinzugefügt werden
    });

    it('renders the Home router link as the FIRST item in the mat-nav-list', async () => {
        // Arrange
        const matNavListDe = fixture.debugElement.query(By.css('mat-nav-list'));
        expect(matNavListDe).toBeDefined();

        // Alle RouterLinks innerhalb der Toolbar in DOM-Reihenfolge
        const linkDes: DebugElement[] = matNavListDe.queryAll(By.directive(RouterLink));
        expect(linkDes.length).toBe(1); // bricht, wenn später mehr Links hinzugefügt werden

        // Wir wollen explizit den ERSTEN Link validieren (links außen)
        const firstLinkDe = linkDes[0];

        // 1) Strukturelle Strenge: es MUSS ein <a> bleiben (kein <button> etc.)
        const native = firstLinkDe.nativeElement as HTMLElement;
        expect(native.tagName).toBe('A'); // bricht, wenn später ein Button verwendet wird

        // 2) Ziel prüfen – bevorzugt über das gerenderte href-Attribut (roh, nicht absolut)
        const hrefAttr = (native as HTMLAnchorElement).getAttribute('href');
        expect(hrefAttr).toBe('/home');

        // 3) Optionaler Gegencheck über die Directive (robust gg. absolute URLs)
        const rl = firstLinkDe.injector.get(RouterLink, null) ?? firstLinkDe.injector.get(RouterLinkWithHref, null);
        expect(rl).toBeTruthy();

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

        const matNavListDe = fixture.debugElement.query(By.css('mat-nav-list'));
        expect(matNavListDe).toBeDefined();
        const linkDe = matNavListDe.query(By.directive(RouterLink));
        expect(linkDe).toBeDefined();
        (linkDe.nativeElement as HTMLAnchorElement).click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(navSpy).toHaveBeenCalledTimes(1);
        const calls = navSpy.mock.calls;
        expect(calls.length).toBe(1);

        const [arg] = calls[0];
        expect(arg).toBeDefined();

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

    it('should render the theme toggle button', async () => {
        const allTooltips = await loader.getAllHarnesses(MatTooltipHarness);
        expect(allTooltips).toBeTruthy();
        expect(allTooltips.length).toBe(1);

        const tooltipHarness = await loader.getHarness(MatTooltipHarness.with({ selector: 'button' }));

        expect(tooltipHarness).toBeDefined();
        await tooltipHarness.show();
        const ttText = await tooltipHarness.getTooltipText();
        expect(ttText.trim()).toBe('umschalten');
    });

    it('toggles aria-label and label text when clicking the theme button - start with dark theme', async () => {
        const store = TestBed.inject(ThemeStore);
        const spy = vi.spyOn(store, 'toggle');

        const btn = await loader.getHarness(MatButtonHarness.with({ selector: 'button.theme-toggle' }));
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

    it('should render version', () => {
        const expectedVersionText = `V1.2.0`;
        const matNavList = findMatNavList(fixture); // Validierung, dass die Liste da ist
        const dividers = matNavList.querySelectorAll('mat-divider');

        const secondDivider = dividers[1] as HTMLElement;
        expect(secondDivider).toBeDefined();

        const versionDiv = secondDivider.nextElementSibling as HTMLElement;
        expect(versionDiv).toBeDefined();
        expect(versionDiv.textContent.trim()).toBe(expectedVersionText);
        expect(versionDiv.tagName.toLowerCase()).toBe('div');
        expect(versionDiv.classList).toContain('version');
        expect(versionDiv.classList).toContain('nav-caption');
    });
});

function findMatNavList(fixture: ComponentFixture<SidenavComponent>): HTMLElement {
    const matNavList = fixture.nativeElement.querySelector('mat-nav-list') as HTMLElement;

    if (!matNavList) {
        throw new Error('No mat-nav-list found');
    }

    return matNavList;
}
