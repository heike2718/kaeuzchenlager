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

  it('should create and be dark', async () => {
    expect(themeStore).toBeTruthy();
    expect(themeStore.theme()).toBe('dark');
    expect(themeStore.isDark()).toBe(true);
  });

  it('should toggle to light and persist this state', async () => {
    const toggleSpy = vi.spyOn(themeStore, 'toggle');

    // arrange: ensure no theme is stored
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    const localStorageSpy = vi.spyOn(Storage.prototype, 'setItem');

    expect(themeStore).toBeTruthy();
    await themeStore.toggle();
    expect(toggleSpy).toHaveBeenCalled();
    expect(themeStore.theme()).toBe('light');
    expect(themeStore.isDark()).toBe(false);
    expect(localStorageSpy).toHaveBeenCalledWith(PREFERRED_THEME_KEY, 'light');
  });

  it('should create and be light when value is persisted', async () => {
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

  it('should create and be light when value is persisted - ohne mock', async () => {
    // arrange: ensure theme is stored as light
    localStorage.setItem(PREFERRED_THEME_KEY, 'light');
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [],
    });

    themeStore = TestBed.inject(ThemeStore);
    expect(setSpy).not.toHaveBeenCalled();

    expect(themeStore).toBeTruthy();
    expect(themeStore.theme()).toBe('light');
    expect(themeStore.isDark()).toBe(false);
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

  it('should toggle twice', async () => {
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
