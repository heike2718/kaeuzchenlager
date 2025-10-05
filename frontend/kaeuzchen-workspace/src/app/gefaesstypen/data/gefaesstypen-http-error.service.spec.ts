import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { GefaesstypenHttpErrorService } from './gefaesstypen-http-error.service';
import { GefaesstypDaten } from '@gefaesstypen/model';
import { ErrorType, KaeuzchenError } from '@core/model';
import { ErrorService } from '@core/services';

describe('GefaesstypenHttpErrorService', () => {
  let errorService: GefaesstypenHttpErrorService;

  const expectedErrorType: ErrorType = 'SERVER';

  const kaeuzchenError: KaeuzchenError = {
    message: 'uiuiuiuiui',
    type: expectedErrorType,
  };

  const errorServiceMock = {
    toKaeuzchenError: vi.fn(() => {
      return kaeuzchenError;
    }),
  };

  const userInput: GefaesstypDaten = {
    anzahl: 3,
    backgroundColor: '#ccffcc',
    name: 'Zweiter Gefäßtyp',
    volumen: 20,
    version: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GefaesstypenHttpErrorService,
        { provide: ErrorService, useValue: errorServiceMock },
      ],
    });

    errorService = TestBed.inject(GefaesstypenHttpErrorService);
    vi.resetAllMocks();
  });

  it('handles errors', () => {
    const httpError = new HttpErrorResponse({
      status: 409,
      error: {
        errorLevel: 'ERROR',
        message: 'Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.',
      },
    });

    const gefaesstypError = errorService.toGefaesstypError(httpError, userInput);

    expect(gefaesstypError).toBeDefined();
    expect(gefaesstypError.serverVersion).toBeNull();
    expect(gefaesstypError.userInput).toEqual(userInput);
    expect(gefaesstypError.uuid).toBeNull();
    expect(gefaesstypError.message).toBe(kaeuzchenError.message);
    expect(gefaesstypError.type).toBe(expectedErrorType);

    expect(errorServiceMock.toKaeuzchenError).toBeCalledTimes(1);
    expect(errorServiceMock.toKaeuzchenError).toHaveBeenCalledWith(httpError);
  });
});
