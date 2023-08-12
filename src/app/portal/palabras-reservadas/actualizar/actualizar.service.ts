import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class ActualizarPalabrasReservadasService {

  constructor (private http: HttpClient) {}

  getPalabraReservada( id: number ) {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/palabras-reservadas/' + id);
  }

  actualizarPalabrasReservadas( id: number, palabra:string ) {
    const body = {"palabra": palabra};
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/palabras-reservadas/' + id, body, {
        observe: 'response'
    });
  }
  
}