import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GefaesstypSelectionService } from './gefaesstyp-selection.service';
import { Gefaesstyp } from '@gefaesstypen/model';
import { firstGefaesstyp, secondGefaesstyp, thirdGefaesstyp } from '@testing';
import { gefaesstypenActions } from '@gefaesstypen/data';

describe('GefaesstypSelectionService', () => {
    let selectionService: GefaesstypSelectionService;
    let store: MockStore;
    let dispatchSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GefaesstypSelectionService, provideMockStore()],
        });

        store = TestBed.inject(MockStore);
        selectionService = TestBed.inject(GefaesstypSelectionService);

        dispatchSpy = vi.spyOn(store, 'dispatch');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('dispatches gefaesstypEditorNavigationFailed when gefaesstyp not found', () => {
        // arrange
        const gefaesstypen: Gefaesstyp[] = [firstGefaesstyp];
        const uuid = secondGefaesstyp.uuid;

        // act
        selectionService.checkAndSelectOrRedirect(uuid, gefaesstypen);

        // assert
        expect(dispatchSpy).toHaveBeenCalledWith(gefaesstypenActions.gefaesstypEditorNavigationFailed());
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    it('dispatches selectGefaesstypByUuid when gefaesstyp found', () => {
        // arrange
        const gefaesstypen: Gefaesstyp[] = [firstGefaesstyp, secondGefaesstyp, thirdGefaesstyp];
        const uuid = secondGefaesstyp.uuid;

        // act
        selectionService.checkAndSelectOrRedirect(uuid, gefaesstypen);

        // assert
        expect(dispatchSpy).toHaveBeenCalledWith(gefaesstypenActions.selectGefaesstypByUuid({ uuid }));
        expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
});
