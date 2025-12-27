import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gefaesstyp, GefaesstypDaten } from '@gefaesstypen/model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenHttpService {
    #url = '/kaeuzchenlager/api/gefaesstypen';
    #httpClient = inject(HttpClient);

    public loadGefaesstypen(): Observable<Gefaesstyp[]> {
        return this.#httpClient.get<Gefaesstyp[]>(this.#url, { headers: new HttpHeaders() });
    }

    public insertGefaesstyp(gefaessytp: Gefaesstyp): Observable<Gefaesstyp> {
        return this.#httpClient.post<Gefaesstyp>(this.#url, gefaessytp, { headers: new HttpHeaders() });
    }

    public updateGefaesstyp(uuid: string, daten: GefaesstypDaten): Observable<Gefaesstyp> {
        return this.#httpClient.put<Gefaesstyp>(this.#url + '/' + uuid, daten, { headers: new HttpHeaders() });
    }

    public removeGefaesstyp(uuid: string): Observable<void> {
        return this.#httpClient.delete<void>(this.#url + '/' + uuid, { headers: new HttpHeaders() });
    }

    public loadGefaesstypWithId(uuid: string): Observable<Gefaesstyp> {
        return this.#httpClient.get<Gefaesstyp>(this.#url + '/' + uuid, { headers: new HttpHeaders() });
    }
}
