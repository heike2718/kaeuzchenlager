import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService, SILENT_LOAD_CONTEXT } from '@core/services';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    #loadingService = inject(LoadingService);

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.context.get(SILENT_LOAD_CONTEXT)) {
            return next.handle(req);
        }

        this.#loadingService.start();
        return next.handle(req).pipe(finalize(() => this.#loadingService.stop()));
    }
}
