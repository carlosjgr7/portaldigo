import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class ActualizarOperadorasService {

  constructor (private http: HttpClient) {}

  getOperadora( id: number ) {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/operadoras/' + id);
  }

  actualizarOperadoras( id: number, codigo:string, nombre:string, activo:boolean) {
    const body = {
            "codigo": codigo,
            "nombre" : nombre,
            "activo" : activo
        };
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/operadoras/' + id, body, {
        observe: 'response'
    });
  }
  
}