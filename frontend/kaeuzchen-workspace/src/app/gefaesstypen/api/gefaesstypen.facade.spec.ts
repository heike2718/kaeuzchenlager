import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { GefaesstypenFacade } from './gefaesstypen.facade';
import { fromGefaesstypen, gefaesstypenActions } from '@gefaesstypen/data';
import { Gefaesstyp, GefaesstypConflict } from '@gefaesstypen/model';
import { firstGefaesstyp, secondGefaesstyp, thirdGefaesstyp } from '@testing';
import { GefaesstypSelectionService } from './gefaesstyp-selection.service';

describe('GefaesstypenFacade', () => {
    let facade: GefaesstypenFacade;
    let store: MockStore;
    let selectionServiceMock: { checkAndSelectOrRedirect: (uuid: string, list: Gefaesstyp[]) => void };

    let dispatchSpy: ReturnType<typeof vi.spyOn>;
    let selectionSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        selectionServiceMock = {
            checkAndSelectOrRedirect: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                GefaesstypenFacade,
                provideMockStore(),
                { provide: GefaesstypSelectionService, useValue: selectionServiceMock },
            ],
        });
        facade = TestBed.inject(GefaesstypenFacade);
        store = TestBed.inject(MockStore);

        dispatchSpy = vi.spyOn(store, 'dispatch');
        selectionSpy = vi.spyOn(selectionServiceMock, 'checkAndSelectOrRedirect');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('test Observables', () => {
        it('gefaesstypenLoading$ passt zum state', async () => {
            const loading = store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoading, false);

            expect(await firstValueFrom(facade.gefaesstypenLoading$.pipe(take(1)))).toBe(false);

            loading.setResult(true);
            store.refreshState();

            expect(await firstValueFrom(facade.gefaesstypenLoading$.pipe(take(1)))).toBe(true);
        });
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
            const selectedGefaesstyp = store.overrideSelector(fromGefaesstypen.selectSelectedGefasesstyp, null);

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

            const gefaesstypeConflict = store.overrideSelector(fromGefaesstypen.selectGefaesstypConflict, null);

            expect(await firstValueFrom(facade.gefaesstypConflict$.pipe(take(1)))).toBeNull();

            gefaesstypeConflict.setResult(gefaesstypConflictValue);
            store.refreshState();

            const result = await firstValueFrom(facade.gefaesstypConflict$.pipe(take(1)));

            expect(result).toStrictEqual(gefaesstypConflictValue);
        });
    });

    describe('test loading', () => {
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
    });

    describe('test ensureGefaesstypenLoadedAndSelect', () => {
        it('dispatches loadGefaesstypen when not loaded and not loading', () => {
            // arrange
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoaded, false);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoading, false);
            store.refreshState(); // selectors feuern sofort

            // act
            facade.ensureGefaesstypenLoadedAndSelect(secondGefaesstyp.uuid);

            expect(dispatchSpy).toHaveBeenCalledWith(gefaesstypenActions.loadGefaesstypen());
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(selectionSpy).not.toHaveBeenCalled();
        });
        it('delegates directly to selectionService when loaded and not loading', () => {
            // arrange
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoaded, true);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoading, false);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypen, [secondGefaesstyp]);
            store.refreshState(); // selectors feuern sofort

            // act
            facade.ensureGefaesstypenLoadedAndSelect(secondGefaesstyp.uuid);

            // wird sofort aufgerufen
            expect(dispatchSpy).not.toHaveBeenCalled();
            expect(selectionSpy).toHaveBeenCalledTimes(1);
            expect(selectionSpy).toHaveBeenCalledWith(secondGefaesstyp.uuid, [secondGefaesstyp]);
        });
        it('delegates directly to selectionService when loaded and loading', () => {
            // arrange
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoaded, true);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoading, true);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypen, [secondGefaesstyp]);
            store.refreshState(); // selectors feuern sofort
            // act
            facade.ensureGefaesstypenLoadedAndSelect(secondGefaesstyp.uuid);

            // wird sofort aufgerufen
            expect(dispatchSpy).not.toHaveBeenCalled();
            expect(selectionSpy).toHaveBeenCalledTimes(1);
            expect(selectionSpy).toHaveBeenCalledWith(secondGefaesstyp.uuid, [secondGefaesstyp]);
        });
        it('does not dispatch loadGefaesstypen but waits for loaded and then delegates when not loaded and loading is already true', () => {
            // arrange
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoaded, false);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoading, true);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypen, [secondGefaesstyp]);
            store.refreshState(); // selectors feuern sofort

            // act
            facade.ensureGefaesstypenLoadedAndSelect(secondGefaesstyp.uuid);

            // assert
            // kein load, weil already loading
            expect(dispatchSpy).not.toHaveBeenCalledWith(gefaesstypenActions.loadGefaesstypen());

            // noch nicht delegiert, weil loaded noch false
            expect(selectionSpy).not.toHaveBeenCalled();

            // Abschluss des Ladens simulieren
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoaded, true);
            store.overrideSelector(fromGefaesstypen.selectGefaesstypenLoading, false);
            store.refreshState();

            expect(selectionSpy).toHaveBeenCalledWith(secondGefaesstyp.uuid, [secondGefaesstyp]);

            // kein erneutes laden
            expect(dispatchSpy).not.toHaveBeenCalledWith(gefaesstypenActions.loadGefaesstypen());
        });
    });
});
