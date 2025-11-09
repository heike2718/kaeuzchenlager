import { TestBed } from '@angular/core/testing';
import { PREFERRED_THEME_KEY, ThemeStore } from './theme.store';
import { createEnvironmentInjector, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';

describe('ThemeStore', () => {
    type ThemeStoreInstance = InstanceType<typeof ThemeStore>;

    function setupStore(seed?: 'light' | 'dark'): ThemeStoreInstance {
        localStorage.clear();
        if (seed) localStorage.setItem(PREFERRED_THEME_KEY, seed);
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ providers: [ThemeStore] });
        return TestBed.inject(ThemeStore);
    }

    function getFreshThemeStore(): { store: ThemeStoreInstance; injector: EnvironmentInjector } {
        const parent = TestBed.inject(EnvironmentInjector); // Parent = TestBed
        const freshEnv = createEnvironmentInjector([ThemeStore], parent); // neuer Child-Injector, eigener Scope
        const store = runInInjectionContext(freshEnv, () => inject(ThemeStore));
        return { store, injector: freshEnv };
    }

    afterEach(async () => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        localStorage.clear();
    });

    describe('ThemeStore – creation', () => {
        let themeStore: ThemeStoreInstance;
        beforeEach(() => {
            themeStore = setupStore();
        }); // default: dark

        it('should create and be dark', async () => {
            // arrange: ensure no theme is stored
            localStorage.clear();
            expect(themeStore).toBeTruthy();
            expect(themeStore.theme()).toBe('dark');
            expect(themeStore.isDark()).toBe(true);
            expect(themeStore.ariaLabel()).toBe('auf helles Design umschalten');
            expect(themeStore.caption()).toBe('helles Design');
            expect(themeStore.icon()).toBe('light_mode');
        });

        it('should ignore invalid key', async () => {
            localStorage.setItem(PREFERRED_THEME_KEY, 'banane');
            const setSpy = vi.spyOn(Storage.prototype, 'setItem');

            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [],
            });

            themeStore = TestBed.inject(ThemeStore);
            expect(setSpy).not.toHaveBeenCalled();

            expect(themeStore).toBeTruthy();
            expect(themeStore.theme()).toBe('dark');
            expect(themeStore.isDark()).toBe(true);
        });
    });

    describe('ThemeStore – persistence', () => {
        let themeStore: ThemeStoreInstance;
        beforeEach(() => {
            themeStore = setupStore();
        }); // default: dark

        it('should create and be light when value is persisted - mit Storage-Mock', async () => {
            // arrange: ensure theme is stored as light
            const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');
            const setSpy = vi.spyOn(Storage.prototype, 'setItem');

            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [],
            });

            themeStore = TestBed.inject(ThemeStore);
            await Promise.resolve(); // warten, bis onInit durch ist

            expect(getSpy).toHaveBeenCalled(); // nur ob überhaupt
            expect(getSpy).toHaveBeenCalledWith(PREFERRED_THEME_KEY); // nur der Key);
            expect(setSpy).not.toHaveBeenCalled();

            expect(themeStore).toBeTruthy();
            expect(themeStore.theme()).toBe('light');
            expect(themeStore.isDark()).toBe(false);
        });

        it('should be light when value is persisted - ohne mock', async () => {
            // arrange: ensure theme is stored as light
            localStorage.setItem(PREFERRED_THEME_KEY, 'light');

            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [],
            });

            themeStore = TestBed.inject(ThemeStore);

            expect(themeStore).toBeTruthy();
            expect(themeStore.theme()).toBe('light');
            expect(themeStore.isDark()).toBe(false);
            expect(themeStore.ariaLabel()).toBe('auf dunkles Design umschalten');
            expect(themeStore.caption()).toBe('dunkles Design');
            expect(themeStore.icon()).toBe('dark_mode');
            expect(localStorage.getItem(PREFERRED_THEME_KEY)).toBe('light');
        });

        it('should persist dark after toggle from light', async () => {
            // arrange: ensure theme is stored as light
            localStorage.setItem(PREFERRED_THEME_KEY, 'light');

            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [],
            });

            themeStore = TestBed.inject(ThemeStore);
            await Promise.resolve(); // warten, bis onInit durch ist

            await themeStore.toggle();

            expect(themeStore).toBeTruthy();
            expect(themeStore.theme()).toBe('dark');
            expect(themeStore.isDark()).toBe(true);
            expect(localStorage.getItem(PREFERRED_THEME_KEY)).toBe('dark');
        });

        it('should persist light after toggle from dark', async () => {
            // arrange: ensure theme is stored as light
            localStorage.setItem(PREFERRED_THEME_KEY, 'dark');

            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [],
            });

            themeStore = TestBed.inject(ThemeStore);
            await Promise.resolve(); // warten, bis onInit durch ist

            await themeStore.toggle();

            expect(themeStore).toBeTruthy();
            expect(themeStore.theme()).toBe('light');
            expect(themeStore.isDark()).toBe(false);
            expect(localStorage.getItem(PREFERRED_THEME_KEY)).toBe('light');
        });

        it('warns when a stubbed localStorage throws on setItem', async () => {
            const fakeStorage = {
                getItem: vi.fn(() => null),
                setItem: vi.fn(() => {
                    throw new Error('boom');
                }),
                removeItem: vi.fn(),
                clear: vi.fn(),
            };
            vi.stubGlobal('localStorage', fakeStorage);
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
                return;
            });

            const store = setupStore(); // liest getItem() -> null (default dark)
            await store.toggle(); // persist() -> setItem() -> throw -> catch

            expect(warnSpy).toHaveBeenCalledOnce();
        });
    });

    describe('ThemeStore – reload', () => {
        it('persists theme across a fresh injector (simulated app restart)', async () => {
            // 1. Instanz (App-Lauf 1)
            const first = TestBed.inject(ThemeStore);
            expect(first.theme()).toBe('dark');
            expect(first.isDark()).toBe(true);

            // Act: Zustand ändern und persistieren
            await first.toggle(); // -> light
            expect(localStorage.getItem(PREFERRED_THEME_KEY)).toBe('light');

            // Neustart“: neue DI-Instanz im selben Test
            const { store: fresh, injector } = getFreshThemeStore();
            try {
                // Assert: frische Instanz liest Persistenz (onInit) und startet dunkel
                expect(fresh.theme()).toBe('light');
                expect(fresh.isDark()).toBe(false);
            } finally {
                // wichtig: neuen Injector wieder schließen
                injector.destroy();
            }
        });
    });
});
