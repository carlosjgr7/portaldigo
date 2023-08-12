import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class CrearBancosService {

  constructor (private http: HttpClient) {}

  crearBancos( codigo:string, nombre, nombreCorto:string, activo:boolean, servicios:any ) {
    const body = {
    				"codigo": codigo,
    				"nombre" : nombre,
    				"nombreCorto" : nombreCorto,
    				"activo" : activo,
            "servicios" : servicios
				};
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos', body, {
        observe: 'response'
    });
  }

  
}