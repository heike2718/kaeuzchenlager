import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { AuthFacade } from '@shared/auth/api';

describe('HomeComponent general', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
        login: vi.fn(),
        logout: vi.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent],
            providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        await render(fixture);
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render logo with correct attributes', () => {
        const logo = fixture.nativeElement.querySelector('img') as HTMLImageElement;

        expect(logo).toBeTruthy();
        expect(logo.src).toContain('assets/images/kl-logo.svg');
        expect(logo.alt).toBe('Käuzchenlager Logo');
        expect(logo.getAttribute('role')).toBe('img');
        expect(logo.classList.contains('logo-image')).toBe(true); // Korrigiert
    });
});

describe('HomeComponent handset', () => {
    describe('logged out', () => {
        let component: HomeComponent;
        let fixture: ComponentFixture<HomeComponent>;

        const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
            login: vi.fn(),
            logout: vi.fn(),
            authorizationState$: of('loggedOut'),
        };

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [HomeComponent],
                providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
            }).compileComponents();

            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            component.isHandset$ = of(true);
            await render(fixture);
        });
        it('should render header Privatzone when handset', () => {
            const el = fixture.nativeElement.querySelector('h1.home__title') as HTMLElement;

            expect(el).toBeTruthy();
            expect(el.textContent?.trim()).toBe('Privatzone');
        });
        it('should render the paragraph below the header when handset', () => {
            const header = fixture.nativeElement.querySelector('header.home__header') as HTMLElement;
            expect(header).toBeTruthy();

            const paragraph = header.nextElementSibling as HTMLElement;

            expect(paragraph.tagName).toBe('P');
            expect(paragraph.textContent?.trim()).toContain('Bitte einloggen.');
        });

        it('should render exactly one paragraph with short text for not logged in', () => {
            const paragraphs = fixture.nativeElement.querySelectorAll('p');

            expect(paragraphs.length).toBe(1);
            expect(paragraphs[0].textContent?.trim()).toBe('Bitte einloggen.');
        });
        it('should render one button', () => {
            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(1);
            expect(buttons[0].textContent?.trim()).toBe('einloggen');
        });

        it('should call login when clicking the login button', async () => {
            const authFacade = TestBed.inject(AuthFacade);
            const loginSpy = vi.spyOn(authFacade, 'login');

            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(1);

            const button = buttons[0];
            button.click();

            expect(loginSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('unauthorized', () => {
        let component: HomeComponent;
        let fixture: ComponentFixture<HomeComponent>;

        const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
            login: vi.fn(),
            logout: vi.fn(),
            authorizationState$: of('unauthorized'),
        };

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [HomeComponent],
                providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
            }).compileComponents();

            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            component.isHandset$ = of(true);
            await render(fixture);
        });
        it('should not render any header', () => {
            const el = fixture.nativeElement.querySelector('h1.home__title') as HTMLElement;

            expect(el).toBeFalsy();
        });

        it('should render exactly one paragraph when unauthorized', () => {
            const paragraphs = fixture.nativeElement.querySelectorAll('p');

            expect(paragraphs.length).toBe(1);
            expect(paragraphs[0].textContent?.trim()).toBe(
                'Vielen Dank für Ihren Besuch, aber Sie sind leider nicht autorisiert für diese Webseite. Loggen Sie sich am besten einfach wieder aus.'
            );
        });

        it('should render one button', () => {
            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(1);
            expect(buttons[0].textContent?.trim()).toBe('ausloggen');
        });

        it('should call logout when clicking the logout button', async () => {
            const authFacade = TestBed.inject(AuthFacade);
            const logoutSpy = vi.spyOn(authFacade, 'logout');

            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(1);

            const logoutButton = buttons[0];
            logoutButton.click();

            expect(logoutSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('authorized', () => {
        let component: HomeComponent;
        let fixture: ComponentFixture<HomeComponent>;

        const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
            login: vi.fn(),
            logout: vi.fn(),
            authorizationState$: of('authorized'),
        };

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [HomeComponent],
                providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
            }).compileComponents();

            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            component.isHandset$ = of(true);
            await render(fixture);
        });
        it('should render header Käuzchenlager when handset', () => {
            const el = fixture.nativeElement.querySelector('h1.home__title') as HTMLElement;

            expect(el).toBeTruthy();
            expect(el.textContent?.trim()).toBe('Käuzchenlager');
        });

        it('should render two buttons', () => {
            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(2);
            expect(buttons[0].textContent?.trim()).toBe('Gefäßtypen');
            expect(buttons[1].textContent?.trim()).toBe('ausloggen');
        });

        it('should navigate to gefaesstypen', async () => {
            const router = TestBed.inject(Router);
            const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(2);
            const btn = buttons[0];
            await btn.click();
            fixture.detectChanges();

            const calls = spy.mock.calls;
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

        it('should call logout when clicking the logout button', async () => {
            const authFacade = TestBed.inject(AuthFacade);
            const logoutSpy = vi.spyOn(authFacade, 'logout');

            const buttons = fixture.nativeElement.querySelectorAll('button.home__button');
            expect(buttons.length).toBe(2);
            const btn = buttons[1];

            await btn.click();

            expect(logoutSpy).toHaveBeenCalledTimes(1);
        });
    });
});

describe('HomeComponent not handset', () => {
    describe('logged out', () => {
        let fixture: ComponentFixture<HomeComponent>;

        const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
            login: vi.fn(),
            logout: vi.fn(),
            authorizationState$: of('loggedOut'),
        };

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [HomeComponent],
                providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
            }).compileComponents();

            fixture = TestBed.createComponent(HomeComponent);
            await render(fixture);
        });
        it('should render header Privatzone when not handset', () => {
            const el = fixture.nativeElement.querySelector('h1.home__title') as HTMLElement;

            expect(el).toBeTruthy();
            expect(el.textContent?.trim()).toBe('Privatzone');
        });
        it('should render the paragraph below the header when not handset', () => {
            const header = fixture.nativeElement.querySelector('header.home__header') as HTMLElement;
            expect(header).toBeTruthy();

            const paragraph = header.nextElementSibling as HTMLElement;

            expect(paragraph.tagName).toBe('P');
            expect(paragraph.textContent?.trim()).toContain('Bitte loggen Sie sich ein.');
        });

        it('should render exactly one paragraph with long text for not logged in', () => {
            const paragraphs = fixture.nativeElement.querySelectorAll('p');

            expect(paragraphs.length).toBe(1);
            expect(paragraphs[0].textContent?.trim()).toBe('Bitte loggen Sie sich ein.');
        });
    });

    describe('unauthorized', () => {
        let fixture: ComponentFixture<HomeComponent>;

        const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
            login: vi.fn(),
            logout: vi.fn(),
            authorizationState$: of('unauthorized'),
        };

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [HomeComponent],
                providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
            }).compileComponents();

            fixture = TestBed.createComponent(HomeComponent);
            await render(fixture);
        });
        it('should not reander any header', () => {
            const el = fixture.nativeElement.querySelector('h1.home__title') as HTMLElement;

            expect(el).toBeFalsy();
        });
        it('should render exactly one paragraph with long text for unauthorized', () => {
            const paragraphs = fixture.nativeElement.querySelectorAll('p');

            expect(paragraphs.length).toBe(1);
            expect(paragraphs[0].textContent?.trim()).toBe(
                'Vielen Dank für Ihren Besuch, aber Sie sind leider nicht autorisiert für diese Webseite. Loggen Sie sich am besten einfach wieder aus.'
            );
        });
    });

    describe('authorized', () => {
        let fixture: ComponentFixture<HomeComponent>;

        const authFacadeMock: Pick<AuthFacade, 'login' | 'logout'> & Partial<AuthFacade> = {
            login: vi.fn(),
            logout: vi.fn(),
            authorizationState$: of('authorized'),
        };

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [HomeComponent],
                providers: [{ provide: AuthFacade, useValue: authFacadeMock }],
            }).compileComponents();

            fixture = TestBed.createComponent(HomeComponent);
            fixture.detectChanges();
        });
        it('should not render any header', () => {
            const el = fixture.nativeElement.querySelector('h1.home__title') as HTMLElement;

            expect(el).toBeFalsy();
        });
        it('should not render any paragraph', () => {
            const paragraphs = fixture.nativeElement.querySelectorAll('p');

            expect(paragraphs.length).toBe(0);
        });
    });
});

async function render(fixture: ComponentFixture<HomeComponent>) {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}
