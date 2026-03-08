import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { HomeComponent } from '../../home/home.component';
import { Router, RouterLink, RouterLinkWithHref, RouterModule, UrlTree } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ThemeStore } from '../theme.store';
import { KL_CONFIGURATION } from '@config';
import { mockConfig } from '@testing';
import { AuthFacade } from '@shared/auth/api';
import { of } from 'rxjs';

describe('SidenavComponent loggedOut', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
        login: vi.fn(),
        logout: vi.fn(),
        authorizationState$: of('loggedOut'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidenavComponent, HomeComponent, RouterModule.forRoot([{ path: '', component: HomeComponent }])],
            providers: [
                { provide: KL_CONFIGURATION, useValue: mockConfig },
                { provide: AuthFacade, useValue: authFacadeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and be closed', async () => {
        expect(component).toBeTruthy();
    });

    it('renders a sidenav', () => {
        const matNavList = findMatNavListAsDebugElement(fixture);
        expect(matNavList).toBeDefined();
    });

    it('renders the footer with version', () => {
        const footer: DebugElement = fixture.debugElement.query(By.css('div.sidenav__footer'));
        expect(footer).not.toBeNull();
        expect(footer).toBeDefined();

        const versionElement: DebugElement = footer.query(By.css('div.sidenav__version'));
        expect(versionElement).not.toBeNull();
        expect(versionElement).toBeDefined();

        const versionNative: HTMLElement = versionElement.nativeElement;
        expect(versionNative.textContent.trim()).toBe('V 1.2.0');
    });

    it('navigates to /home when clicking the Home link', async () => {
        const router = TestBed.inject(Router);
        const navSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

        const matNavListDe = findMatNavListAsDebugElement(fixture);
        expect(matNavListDe).toBeDefined();

        const linkDes: DebugElement[] = matNavListDe.queryAll(By.directive(RouterLink));
        expect(linkDes.length).toBe(1); // bricht, wenn später mehr Links hinzugefügt werden
        const routerLinkDe = linkDes[0];
        expect(routerLinkDe).toBeDefined();
        (routerLinkDe.nativeElement as HTMLAnchorElement).click();

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

    it('toggles aria-label and label text when clicking the theme button - start with dark theme', async () => {
        const store = TestBed.inject(ThemeStore);
        const spy = vi.spyOn(store, 'toggle');

        const btn = fixture.nativeElement.querySelector('button.sidenav__toggle') as HTMLButtonElement;
        expect(btn).toBeTruthy();

        await fixture.whenStable();

        expect(btn.getAttribute('aria-label')).toBe('auf hellen Stil umschalten');

        let caption = btn.querySelector('span.sidenav__caption') as HTMLElement;
        expect(caption.textContent?.trim()).toBe('heller Stil');

        btn.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(1);

        expect(btn.getAttribute('aria-label')).toBe('auf dunklen Stil umschalten');
        caption = btn.querySelector('span.sidenav__caption') as HTMLElement;
        expect(caption.textContent?.trim()).toBe('dunkler Stil');

        btn.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledTimes(2);

        const captionHell = btn.querySelector('span.sidenav__caption') as HTMLElement;
        expect(captionHell.textContent?.trim()).toBe('heller Stil');

        expect(btn.getAttribute('aria-label')).toBe('auf hellen Stil umschalten');
    });

    it('does not render the Gefaesstypen router link', async () => {
        // Arrange
        const matNavListDe = findMatNavListAsDebugElement(fixture);
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
    });
});

describe('SidenavComponent unauthorized', () => {
    let fixture: ComponentFixture<SidenavComponent>;

    const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
        login: vi.fn(),
        logout: vi.fn(),
        authorizationState$: of('unauthorized'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidenavComponent, HomeComponent, RouterModule.forRoot([{ path: '', component: HomeComponent }])],
            providers: [
                { provide: KL_CONFIGURATION, useValue: mockConfig },
                { provide: AuthFacade, useValue: authFacadeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        fixture.detectChanges();
    });

    it('does not render the Gefaesstypen router link', async () => {
        // Arrange
        const matNavListDe = findMatNavListAsDebugElement(fixture);
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
    });
});

describe('SidenavComponent authorized', () => {
    let fixture: ComponentFixture<SidenavComponent>;

    const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
        login: vi.fn(),
        logout: vi.fn(),
        authorizationState$: of('authorized'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidenavComponent, HomeComponent, RouterModule.forRoot([{ path: '', component: HomeComponent }])],
            providers: [
                { provide: KL_CONFIGURATION, useValue: mockConfig },
                { provide: AuthFacade, useValue: authFacadeMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        fixture.detectChanges();
    });

    it('renders the Home router link as the FIRST item in the sidenav', async () => {
        // Arrange
        const matNavListDe = findMatNavListAsDebugElement(fixture);
        expect(matNavListDe).toBeDefined();

        // Alle RouterLinks innerhalb der Toolbar in DOM-Reihenfolge
        const linkDes: DebugElement[] = matNavListDe.queryAll(By.directive(RouterLink));
        expect(linkDes.length).toBe(2); // bricht, wenn später mehr Links hinzugefügt werden

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
        const iconDe = firstLinkDe.query(By.css('mat-icon.sidenav__icon'));
        expect(iconDe).toBeTruthy();
        expect(iconDe.nativeElement.textContent.trim()).toBe('home');

        const captionDe = firstLinkDe.query(By.css('span.sidenav__caption'));
        expect(captionDe).toBeTruthy();
        expect(captionDe.nativeElement.textContent.trim()).toBe('Startseite');

        // 5) (A11y) Wenn das Icon dekorativ sein soll
        expect(iconDe.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders the Gefaesstypen router link as the SECOND item in the sidenav', async () => {
        // Arrange
        const matNavListDe = findMatNavListAsDebugElement(fixture);
        expect(matNavListDe).toBeDefined();

        // Alle RouterLinks innerhalb der Toolbar in DOM-Reihenfolge
        const linkDes: DebugElement[] = matNavListDe.queryAll(By.directive(RouterLink));
        expect(linkDes.length).toBe(2); // bricht, wenn später mehr Links hinzugefügt werden

        // Wir wollen explizit den ZWEITEN Link validieren (links außen)
        const firstLinkDe = linkDes[1];

        // 1) Strukturelle Strenge: es MUSS ein <a> bleiben (kein <button> etc.)
        const native = firstLinkDe.nativeElement as HTMLElement;
        expect(native.tagName).toBe('A'); // bricht, wenn später ein Button verwendet wird

        // 2) Ziel prüfen – bevorzugt über das gerenderte href-Attribut (roh, nicht absolut)
        const hrefAttr = (native as HTMLAnchorElement).getAttribute('href');
        expect(hrefAttr).toBe('/gefaesstypen');

        // 3) Optionaler Gegencheck über die Directive (robust gg. absolute URLs)
        const rl = firstLinkDe.injector.get(RouterLink, null) ?? firstLinkDe.injector.get(RouterLinkWithHref, null);
        expect(rl).toBeTruthy();

        // 4) Kinder prüfen: Icon + Caption innerhalb GENAU dieses Links
        const iconDe = firstLinkDe.query(By.css('mat-icon.sidenav__icon'));
        expect(iconDe).toBeTruthy();
        expect(iconDe.nativeElement.textContent.trim()).toBe('inventory_2');

        const captionDe = firstLinkDe.query(By.css('span.sidenav__caption'));
        expect(captionDe).toBeTruthy();
        expect(captionDe.nativeElement.textContent.trim()).toBe('Gefäßtypen');

        // 5) (A11y) Wenn das Icon dekorativ sein soll
        expect(iconDe.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('navigates to /gefaesstypen when clicking the Gefaesstypen link', async () => {
        const router = TestBed.inject(Router);
        const navSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

        const matNavListDe = findMatNavListAsDebugElement(fixture);
        expect(matNavListDe).toBeDefined();

        // Alle RouterLinks innerhalb der Toolbar in DOM-Reihenfolge
        const linkDes: DebugElement[] = matNavListDe.queryAll(By.directive(RouterLink));
        expect(linkDes.length).toBe(2); // bricht, wenn später mehr Links hinzugefügt werden

        const routerLinkDe = linkDes[1];
        expect(routerLinkDe).toBeDefined();
        (routerLinkDe.nativeElement as HTMLAnchorElement).click();

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

        expect(path).toBe('/gefaesstypen');
    });
});

function findMatNavListAsDebugElement(fixture: ComponentFixture<SidenavComponent>): DebugElement {
    const matNavListDe = fixture.debugElement.query(By.css('mat-nav-list.sidenav'));

    if (!matNavListDe) {
        throw new Error('No sidenav found');
    }

    return matNavListDe;
}
