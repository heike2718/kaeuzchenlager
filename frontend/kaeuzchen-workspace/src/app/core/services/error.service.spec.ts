import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { ErrorType } from '@core/model';

describe('GefaesstypenHttpErrorService', () => {
    let errorService: ErrorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ErrorService],
        });

        errorService = TestBed.inject(ErrorService);
        vi.resetAllMocks();
    });

    it('handles JSON', () => {
        const expectedErrorType: ErrorType = 'CONCURRENT_UPDATE';

        const httpError = new HttpErrorResponse({
            status: 409,
            error: {
                errorLevel: 'ERROR',
                message: 'Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.',
            },
        });

        const result = errorService.toKaeuzchenError(httpError);

        expect(result).toBeDefined();
        expect(result.message).toBe('Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.');
        expect(result.type).toBe(expectedErrorType);
    });

    it('handles text', () => {
        const expectedErrorType: ErrorType = 'CONCURRENT_UPDATE';

        const httpError = new HttpErrorResponse({
            status: 409,
            error: 'Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.',
        });

        const result = errorService.toKaeuzchenError(httpError);

        expect(result).toBeDefined();
        expect(result.message).toBe('Der Gefäßtyp wurde in der Zwischenzeit von jemand anderem geändert.');
        expect(result.type).toBe(expectedErrorType);
    });

    it('handles ohne error', () => {
        const expectedErrorType: ErrorType = 'SERVER';

        const httpError = new HttpErrorResponse({
            status: 0,
        });

        const result = errorService.toKaeuzchenError(httpError);

        expect(result).toBeDefined();
        expect(result.message).toBe('Unerwarteter Fehler');
        expect(result.type).toBe(expectedErrorType);
    });

    it('allgemeiner error', () => {
        const expectedErrorType: ErrorType = 'SERVER';

        const error = new Error('boom!');

        const result = errorService.toKaeuzchenError(error);

        expect(result).toBeDefined();
        expect(result.message).toBe('boom!');
        expect(result.type).toBe(expectedErrorType);
    });
});
