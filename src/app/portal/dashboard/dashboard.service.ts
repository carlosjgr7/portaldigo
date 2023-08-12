import { Injectable }from '@angular/core';
import { HttpClient }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';




@Injectable()
export class DashboardService {

  constructor (private http: HttpClient) {}

  tablero () { 
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/reportes/tablero');
  }
  
}