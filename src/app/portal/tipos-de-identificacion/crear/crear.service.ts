import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class CrearTiposDeIdentificacionService {

  constructor (private http: HttpClient) {}

  crearBancos( tipoPersona: string, codigo:string, descripcion:string, activo:boolean  ) {
    const body = {
      "tipoPersona" : tipoPersona,
      "codigo" :codigo,
      "descripcion" : descripcion,
      "activo" : activo,
    };
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/tipos-identificacion', body, {
        observe: 'response'
    });
  }

  
}