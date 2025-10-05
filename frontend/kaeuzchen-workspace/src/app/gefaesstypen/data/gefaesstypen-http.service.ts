import { Injectable } from '@angular/core';
import { Gefaesstyp, GefaesstypDaten } from '@gefaesstypen/model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GefaesstypenHttpService {
  /** läd die Gefäßtypen aus dem backend */
  public loadGefaesstypen(): Observable<Gefaesstyp[]> {
    const firstGefaesstyp: Gefaesstyp = {
      uuid: '1234',
      daten: {
        anzahl: 4,
        backgroundColor: '#ff0066',
        name: 'Erster Gefäßtyp',
        volumen: 5,
        version: 2,
      },
    };

    const secondGefaesstyp: Gefaesstyp = {
      uuid: '9876',
      daten: {
        anzahl: 3,
        backgroundColor: '#ccffcc',
        name: 'Zweiter Gefäßtyp',
        volumen: 20,
        version: 0,
      },
    };

    const mockedGefaesstypen: Gefaesstyp[] = [firstGefaesstyp, secondGefaesstyp];

    return of(mockedGefaesstypen);
  }

  public insertGefaesstyp(daten: GefaesstypDaten): Observable<Gefaesstyp> {
    const result: Gefaesstyp = {
      uuid: 'de5d09e4-a8f1-4ca3-a2ef-fddd558ded42',
      daten: { ...daten, version: 0 },
    };

    return of(result);
  }

  public updateGefaesstyp(uuid: string, daten: GefaesstypDaten): Observable<Gefaesstyp> {
    const result: Gefaesstyp = {
      uuid: uuid,
      daten: { ...daten, version: daten.version + 1 },
    };

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
}
