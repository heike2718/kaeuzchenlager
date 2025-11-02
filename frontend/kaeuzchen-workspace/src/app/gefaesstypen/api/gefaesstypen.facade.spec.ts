import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { GefaesstypenFacade } from './gefaesstypen.facade';
import { fromGefaesstypen, gefaesstypenActions } from '@gefaesstypen/data';
import { GefaesstypConflict } from '@gefaesstypen/model';
import { NavigationService } from '@core/services';
import { firstGefaesstyp, secondGefaesstyp, thirdGefaesstyp } from '@testing';

describe('GefaesstypenFacade', () => {
  let facade: GefaesstypenFacade;
  let store: MockStore;

  const navigationServiceMock = {
    getRouteGefaesstypenList: vi.fn(),
    getRouteGefaesstypEditor: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GefaesstypenFacade,
        provideMockStore(),
        { provide: NavigationService, useValue: navigationServiceMock },
      ],
    });
    facade = TestBed.inject(GefaesstypenFacade);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Observables', () => {
    it('gefaesstypenLoaded$ passt zum state', async () => {
      const loaded = store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoaded, false);

      expect(await firstValueFrom(facade.gefaesstypenLoaded$.pipe(take(1)))).toBe(false);

      loaded.setResult(true);
      store.refreshState();

      expect(await firstValueFrom(facade.gefaesstypenLoaded$.pipe(take(1)))).toBe(true);
    });
    it('gefaesstypen$ passt zum state', async () => {
      const gefaesstypen = store.overrideSelector(fromGefaesstypen.selectGefaesstypen, []);

      expect(await firstValueFrom(facade.gefaesstypen$.pipe(take(1)))).toStrictEqual([]);

      gefaesstypen.setResult([firstGefaesstyp, secondGefaesstyp, thirdGefaesstyp]);
      store.refreshState();

      const result = await firstValueFrom(facade.gefaesstypen$.pipe(take(1)));

      expect(result.length).toBe(3);
      expect(result[0]).toStrictEqual(firstGefaesstyp);
      expect(result[1]).toStrictEqual(secondGefaesstyp);
      expect(result[2]).toStrictEqual(thirdGefaesstyp);
    });
    it('selectedGefaesstyp$ passt zum store', async () => {
      const selectedGefaesstyp = store.overrideSelector(
        fromGefaesstypen.selectSelectedGefasesstyp,
        null
      );

      expect(await firstValueFrom(facade.selectedGefaesstyp$.pipe(take(1)))).toBeNull();

      selectedGefaesstyp.setResult(secondGefaesstyp);
      store.refreshState();

      const result = await firstValueFrom(facade.selectedGefaesstyp$.pipe(take(1)));

      expect(result).toStrictEqual(secondGefaesstyp);
    });
    it('gefaesstypConflict$ passt zum store', async () => {
      const gefaesstypConflictValue: GefaesstypConflict = {
        serverVersion: firstGefaesstyp,
        userInput: thirdGefaesstyp.daten,
      };

      const gefaesstypeConflict = store.overrideSelector(
        fromGefaesstypen.selectGefaesstypConflict,
        null
      );

      expect(await firstValueFrom(facade.gefaesstypConflict$.pipe(take(1)))).toBeNull();

      gefaesstypeConflict.setResult(gefaesstypConflictValue);
      store.refreshState();

      const result = await firstValueFrom(facade.gefaesstypConflict$.pipe(take(1)));

      expect(result).toStrictEqual(gefaesstypConflictValue);
    });
  });

  describe('test the methods', () => {
    it('triggers loading the gefaesstypen', () => {
      // arrange
      const actionDispatchSpy = vi.spyOn(store, 'dispatch');
      const expectedAction = gefaesstypenActions.loadGefaesstypen();

      // act
      facade.loadGefaesstypen();

      // assert
      expect(actionDispatchSpy).toBeCalledTimes(1);
      expect(actionDispatchSpy).toHaveBeenCalledWith(expectedAction);
    });

    it('triggers selecting the gefaesstyp with correct navigateTo', () => {
      // arrange
      const navigateTo = 'bla';
      const actionDispatchSpy = vi.spyOn(store, 'dispatch');
      const navigationServiceSpy = vi.spyOn(navigationServiceMock, 'getRouteGefaesstypEditor');

      navigationServiceMock.getRouteGefaesstypEditor.mockReturnValue(navigateTo);

      const expectedAction = gefaesstypenActions.selectGefaesstyp({
        uuid: secondGefaesstyp.uuid,
        navigateTo: navigateTo,
      });

      // act
      facade.selectGefaesstyp(secondGefaesstyp);

      // assert
      expect(navigationServiceSpy).toBeCalledTimes(1);
      expect(actionDispatchSpy).toBeCalledTimes(1);
      expect(actionDispatchSpy).toHaveBeenCalledAfter(navigationServiceSpy);
      expect(actionDispatchSpy).toBeCalledWith(expectedAction);
    });
  });
});
