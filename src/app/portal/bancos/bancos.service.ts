import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';


@Injectable()
export class BancosService {

  constructor (private http: HttpClient) {}

  getBancos() {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos');
  }

  getBancosActivos(activo?: number): Observable<any[]> {
    let params = new HttpParams();
    if (activo) { params = params.append('activo', activo.toString())}
    return this.http.get<any[]>(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos-activos', {params: params});
  }

  getBancosEmpresa(activo?: number): Observable<any[]> {
    let params = new HttpParams();
    if (activo) { params = params.append('activo', activo.toString())}
    return this.http.get<any[]>(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos-empresa', {params: params});
  }

  borrarBancos( id: number ) {
    return this.http.delete(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos/' + id, {
        observe: 'response'
    });
  }
  
}