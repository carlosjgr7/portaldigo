import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';

@Injectable()
export class TiposDeIdentificacionService {

  constructor (private http: HttpClient) {}

  getTiposDeIdentificacion() {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/tipos-identificacion');
  }

  borrarTiposDeIdentificacion( id: number ) {
    return this.http.delete(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/tipos-identificacion/' + id, {
        observe: 'response'
    });
  }
  
}