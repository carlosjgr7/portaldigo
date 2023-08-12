import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';

@Injectable()
export class OperadorasService {

  constructor (private http: HttpClient) {}

  getOperadoras() {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/operadoras');
  }

  borrarOperadoras( id: number ) {
    return this.http.delete(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/operadoras/' + id, {
        observe: 'response'
    });
  }
  
}