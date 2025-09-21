import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Gefaesstyp } from "./gefaesstypen.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GefaesstypenHttpService {


  #url = '/api/gefaesstypen/';
  #httpClient = inject(HttpClient);


  loadGefaesstypen(): Observable<Gefaesstyp[]> {

    const headers = new HttpHeaders({ 'API-Version': '1' });

    return this.#httpClient.get<Gefaesstyp[]>(this.#url, { headers: headers });
  }
}
