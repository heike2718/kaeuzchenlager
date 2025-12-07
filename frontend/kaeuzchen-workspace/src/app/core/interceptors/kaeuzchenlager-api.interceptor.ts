import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { KL_CONFIGURATION, KLConfiguration } from '@config';
import { catchError, Observable, throwError } from 'rxjs';

export class KaeuzchenlagerAPIInterceptor implements HttpInterceptor {
    readonly #config: KLConfiguration = inject(KL_CONFIGURATION);

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const url = this.#config.apiUrl + req.url;

        const headers: HttpHeaders = req.headers.append('API-Version', '1').append('Accept', 'application/json');

        // API-Version
        // Es kam vor, dass das SessionCookie nicht im Client ankam.
        // 2 Bedingungen:
        // 1. withCredentials muss true sein
        // 2. Der Name des SessionCookies muss mit JSESSIONID beginnen
        return next
            .handle(
                req.clone({
                    headers: headers,
                    url: url,
                    withCredentials: true,
                })
            )
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // Rethrow the error to be handled by the global error handler
                    return throwError(() => error);
                })
            );
    }
}
