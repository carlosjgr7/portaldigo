import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class CrearPalabrasReservadasService {

  constructor (private http: HttpClient) {}

  crearPalabrasReservadas( palabra:string ) {
    const body = {"palabra": palabra};
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/palabras-reservadas', body, {
        observe: 'response'
    });
  }

  
}