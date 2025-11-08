import { Injectable } from '@angular/core';
import { ErrorType, KaeuzchenError } from '@core/model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    public toKaeuzchenError(error: NonNullable<unknown>): KaeuzchenError {
        const httpError: HttpErrorResponse | undefined = this.#getHttpErrorResponse(error);
        let message = 'Unerwarteter Fehler';
        let errorType: ErrorType = 'SERVER';

        if (httpError) {
            const status = httpError.status;

            switch (status) {
                case 400:
                    errorType = 'VALIDATION';
                    break;
                case 404:
                    errorType = 'NOT_FOUND';
                    break;
                case 409:
                    errorType = 'CONCURRENT_UPDATE';
                    break;
                case 412:
                    errorType = 'DUPLICATE';
                    break;
            }

            if (httpError.error) {
                if (typeof httpError.error === 'object' && 'message' in httpError.error) {
                    message = String(httpError.error.message);
                } else if (typeof httpError.error === 'string' && httpError.error.trim()) {
                    message = httpError.error;
                } else if (httpError.message) {
                    message = httpError.message;
                }
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        return {
            message: message,
            type: errorType,
        };
    }

    #getHttpErrorResponse(error: NonNullable<unknown>): HttpErrorResponse | undefined {
        if (error instanceof HttpErrorResponse) {
            return <HttpErrorResponse>error;
        }

        return undefined;
    }
}
