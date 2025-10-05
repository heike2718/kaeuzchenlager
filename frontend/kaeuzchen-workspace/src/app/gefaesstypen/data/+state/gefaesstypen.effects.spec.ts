import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of, throwError, firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GefaesstypenEffects } from './gefaesstypen.effects';
import { GefaesstypenHttpService } from '../gefaesstypen-http.service';
import { gefaesstypenActions } from './gefaesstypen.actions';
import { Router } from '@angular/router';
import { Gefaesstyp, GefaesstypDaten, GefaesstypError } from '@gefaesstypen/model';
import { GefaesstypenHttpErrorService } from '../gefaesstypen-http-error.service';
import { provideStore } from '@ngrx/store';
import { ErrorType } from '@core/model';

describe('GefaesstypenEffects', () => {
  let actions$: ReplaySubject<unknown>;
  let effects: GefaesstypenEffects;

  const httpServiceMock = {
    loadGefaesstypen: vi.fn(),
    insertGefaesstyp: vi.fn(),
    updateGefaesstyp: vi.fn(),
    removeGefaesstyp: vi.fn(),
  };

  const errorServiceMock = { toGefaesstypError: vi.fn() };

  const routerMock = {
    navigateByUrl: vi.fn(),
  };

  beforeEach(() => {
    actions$ = new ReplaySubject<unknown>(1);

    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        GefaesstypenEffects,
        provideMockActions(() => actions$),
        { provide: GefaesstypenHttpService, useValue: httpServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: GefaesstypenHttpErrorService, useValue: errorServiceMock },
      ],
    });

    effects = TestBed.inject(GefaesstypenEffects);
    vi.resetAllMocks();
  });

  describe('addGefaesstyp', () => {
    it('should call httpService and map to gefaesstypAdded', async () => {
      const daten: GefaesstypDaten = {
        name: 'temp-12345',
        volumen: 2,
        anzahl: 1,
        backgroundColor: '#000000',
        version: null,
      };
      const created: Gefaesstyp = { uuid: 'u-1', daten };
      httpServiceMock.insertGefaesstyp.mockReturnValue(of(created));

      actions$.next(gefaesstypenActions.addGefaesstyp({ daten }));

      const emitted = await firstValueFrom(effects.addGefaesstyp$);

      expect(emitted).toEqual(gefaesstypenActions.gefaesstypAdded({ gefaesstyp: created }));

      expect(httpServiceMock.insertGefaesstyp).toHaveBeenCalledWith(daten);
      expect(httpServiceMock.insertGefaesstyp).toBeCalledTimes(1);
    });

    it('should handle error', async () => {
      const errorType: ErrorType = 'DUPLICATE';

      const error = {
        status: 412,
        error: { level: 'ERROR', message: 'Duplikat' },
      };

      const daten: GefaesstypDaten = {
        name: 'temp-12345',
        volumen: 2,
        anzahl: 1,
        backgroundColor: '#000000',
        version: null,
      };
      const gefaesstypError: GefaesstypError = {
        message: '',
        serverVersion: null,
        type: errorType,
        userInput: daten,
        uuid: null,
      };

      httpServiceMock.insertGefaesstyp.mockReturnValue(throwError(() => error));
      errorServiceMock.toGefaesstypError.mockReturnValue(gefaesstypError);

      actions$.next(gefaesstypenActions.addGefaesstyp({ daten }));
      const emitted = await firstValueFrom(effects.addGefaesstyp$);

      expect(emitted).toEqual(gefaesstypenActions.saveError({ error: gefaesstypError }));

      expect(httpServiceMock.insertGefaesstyp).toHaveBeenCalledWith(daten);
      expect(httpServiceMock.insertGefaesstyp).toBeCalledTimes(1);

      expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledWith(error, daten);
      expect(errorServiceMock.toGefaesstypError).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeGefaesstyp', () => {
    it('should call httpService and map to gefaesstypChanged', async () => {
      const uuid = '1234';
      const daten: GefaesstypDaten = {
        name: 'temp-12345',
        volumen: 2,
        anzahl: 1,
        backgroundColor: '#000000',
        version: 3,
      };

      const changed: Gefaesstyp = { uuid: uuid, daten };
      httpServiceMock.updateGefaesstyp.mockReturnValue(of(changed));

      actions$.next(gefaesstypenActions.changeGefaesstyp({ uuid, daten }));

      const emitted = await firstValueFrom(effects.changeGefaesstyp$);

      expect(httpServiceMock.insertGefaesstyp).not.toHaveBeenCalled();
      expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.updateGefaesstyp).toHaveBeenCalledWith(uuid, daten);

      expect(emitted).toEqual(gefaesstypenActions.gefaesstypChanged({ gefaesstyp: changed }));
    });
  });
});
