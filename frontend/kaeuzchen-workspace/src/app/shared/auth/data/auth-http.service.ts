import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResult, Session } from '@shared/auth/model';
import { AppMessage } from '@core/model';

@Injectable({
    providedIn: 'root',
})
export class AuthHttpService {
    #url = '/kaeuzchenlager/api';
    #httpClient = inject(HttpClient);

    getLoginUrl(): Observable<AppMessage> {
        return this.#httpClient.get<AppMessage>(this.#url + '/session/authurls/login');
    }

    createSession(authResult: AuthResult): Observable<Session> {
        return this.#httpClient.post<Session>(this.#url + '/session/login', authResult);
    }

    logOut(): Observable<AppMessage> {
        return this.#httpClient.delete<AppMessage>(this.#url + '/session/logout');
    }
}
