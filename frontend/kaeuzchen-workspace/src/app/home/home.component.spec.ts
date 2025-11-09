import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router, UrlTree } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { of } from 'rxjs';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        fixture.detectChanges();
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

    it('should render title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('Käuzchenlager');
    });

    describe('when handset', () => {
        beforeEach(async () => {
            component.isHandset$ = of(true);
            fixture.detectChanges();
        });
        it('should render button gefaesstypen', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('button')?.textContent).toContain('Gefäßtypen');
        });

        it('should navigate to gefaesstypen', async () => {
            const router = TestBed.inject(Router);
            const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

            const btn = await loader.getHarness(MatButtonHarness.with({ selector: 'button.home__button' }));
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
    });
});
