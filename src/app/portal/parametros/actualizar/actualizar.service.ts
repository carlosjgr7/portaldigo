import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../../environments/environment';

@Injectable()
export class ActualizarParametrosService {

	constructor ( private http: HttpClient) {}

	getParametro ( id:number ) {
	    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/parametros/' + id);
  	}

  	actualizarParametro ( id:number, valor:string ) {
	    const body = {"valor": valor};
	    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/parametros/' + id, body, {
	        observe: 'response'
	    });
    }

}