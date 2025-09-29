import { TestBed } from '@angular/core/testing';
import { PREFERRED_THEME_KEY, ThemeStore } from './theme.store';

describe('ThemeStore', () => {
  type ThemeStoreInstance = InstanceType<typeof ThemeStore>;
  let themeStore: ThemeStoreInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    });

    themeStore = TestBed.inject(ThemeStore);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('ThemeStore – creation', () => {
    it('should create and be dark', async () => {
      // arrange: ensure no theme is stored
      localStorage.clear();
      expect(themeStore).toBeTruthy();
      expect(themeStore.theme()).toBe('dark');
      expect(themeStore.isDark()).toBe(true);
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

    it('should toggle twice reset the state from light to light', async () => {
      localStorage.setItem(PREFERRED_THEME_KEY, 'light');
      const setSpy = vi.spyOn(Storage.prototype, 'setItem');

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [],
      });

      themeStore = TestBed.inject(ThemeStore);
      await Promise.resolve(); // warten, bis onInit durch ist

      await themeStore.toggle();
      expect(themeStore.theme()).toBe('dark');
      expect(themeStore.isDark()).toBe(true);
      expect(setSpy).toBeCalledTimes(1);

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [],
      });

      themeStore = TestBed.inject(ThemeStore);
      await Promise.resolve(); // warten, bis onInit durch ist
      await themeStore.toggle();
      expect(themeStore.theme()).toBe('light');
      expect(themeStore.isDark()).toBe(false);
      expect(setSpy).toBeCalledTimes(2);
    });
  });
});
