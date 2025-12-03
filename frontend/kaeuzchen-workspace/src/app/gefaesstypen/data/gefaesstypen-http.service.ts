import { Injectable } from '@angular/core';
import { Gefaesstyp, GefaesstypDaten } from '@gefaesstypen/model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenHttpService {
    #mockedGefaesstypen: Gefaesstyp[] = [];

    /** läd die Gefäßtypen aus dem backend */
    public loadGefaesstypen(): Observable<Gefaesstyp[]> {
        this.#mockedGefaesstypen.push({
            uuid: '1234',
            daten: {
                anzahl: 4,
                backgroundColor: '#ff0066',
                name: 'Erster Gefäßtyp',
                volumen: 5,
                version: 2,
            },
        } as Gefaesstyp);

        this.#mockedGefaesstypen.push({
            uuid: '9876',
            daten: {
                anzahl: 3,
                backgroundColor: '#ccffcc',
                name: 'Zweiter Gefäßtyp',
                volumen: 20,
                version: 0,
            },
        } as Gefaesstyp);

        return of(this.#mockedGefaesstypen);
    }

    public insertGefaesstyp(gefaessytp: Gefaesstyp): Observable<Gefaesstyp> {
        // Mock-Implementierung!!!
        const result: Gefaesstyp = {
            ...gefaessytp,
            daten: {
                ...gefaessytp.daten,
                version: 0,
            },
        };

        return of(result);
    }

    public updateGefaesstyp(uuid: string, daten: GefaesstypDaten): Observable<Gefaesstyp> {
        const result: Gefaesstyp = {
            uuid: uuid,
            daten: { ...daten, version: daten.version + 1 },
        };

        this.#mockedGefaesstypen.push(result);

        return of(result);
    }

    public removeGefaesstyp(uuid: string): Observable<void> {
        /*
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  // HTTP Client gibt Observable<void> bei 204 zurück
  */
        console.log(uuid);

        return of();
    }

    public loadGefaesstypWithId(uuid: string): Observable<Gefaesstyp> {
        const serverDaten: GefaesstypDaten = {
            name: 'Miniglas',
            volumen: 2,
            anzahl: 1,
            backgroundColor: '#f30c0cff',
            version: 4,
        };

        return of({
            uuid: uuid,
            daten: serverDaten,
        });
    }
}
