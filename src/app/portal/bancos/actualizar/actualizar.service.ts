import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class ActualizarBancosService {

  constructor (private http: HttpClient) {}

  getBanco( id: number ) {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos/' + id);
  }

  actualizarBancos( id: number, codigo:string, nombre, nombreCorto:string, activo:boolean, servicios:any ) {
    const body = {
            "codigo": codigo,
            "nombre" : nombre,
            "nombreCorto" : nombreCorto,
            "activo" : activo,
            "servicios" : servicios
        };
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos/' + id, body, {
        observe: 'response'
    });
  }
  
}