import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';

@Injectable()
export class PagosService {

  constructor (private http: HttpClient) {}

  getBancos() {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/bancos');
  }

  getPago ( id:number, tipo_movimiento: string ) {
    return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/'+ id + '/' + tipo_movimiento);

  }

  crearExcelApi(tipoPago: string, usuario: string, pagos:any[], nombreArchivo: string, origen: string, sheets:any[])
  {
    let body={nombreArchivo:nombreArchivo, origen: origen,  sheets:sheets, general: pagos};

    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/' + usuario + '/crear-excel-pagos?tipoPago=' + tipoPago, body);
  }

  getPagos (  tipo: string, 
              desde:string, 
              hasta:string,
              banco:number = null,
              telefono: string = null,
              identificacion:string = null,
              ultimo: number = null,
              exportar : boolean = false) {

      if ( banco == null && telefono == null && identificacion == null && ultimo == null ) {
          
          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&exportar='+ exportar);

      }

      if ( banco != null && telefono == null && identificacion == null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&banco=' + banco + '&exportar='+ exportar);

      }

      if ( banco == null && telefono != null && identificacion == null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&telefono=' + telefono + '&exportar='+ exportar);

      }

      if ( banco == null && telefono == null && identificacion != null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&identificacion=' + identificacion + '&exportar='+ exportar);

      }

      if ( banco == null && telefono == null && identificacion == null && ultimo != null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&ultimo=' + ultimo + '&exportar='+ exportar);

      }

      if ( banco != null && telefono != null && identificacion == null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&banco=' + banco + '&telefono=' + telefono + '&exportar='+ exportar);

      }

      if ( banco != null && telefono == null && identificacion != null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&banco=' + banco + '&identificacion=' + identificacion + '&exportar='+ exportar);

      }

      if ( banco != null && telefono == null && identificacion == null && ultimo != null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&banco=' + banco + '&ultimo=' + ultimo + '&exportar='+ exportar);

      }

      if ( banco != null && telefono != null && identificacion != null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&banco=' + banco + '&telefono=' + telefono + '&identificacion=' + identificacion + '&exportar='+ exportar);

      }

      if ( banco != null && telefono != null && identificacion != null && ultimo != null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&banco=' + banco + '&telefono=' + telefono + '&identificacion=' + identificacion + '&ultimo=' + ultimo + '&exportar='+ exportar);

      }

      if ( banco == null && telefono != null && identificacion != null && ultimo == null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&telefono=' + telefono + '&identificacion=' + identificacion + '&exportar='+ exportar);

      }

      if ( banco == null && telefono == null && identificacion != null && ultimo != null ) {

          return this.http.get(
            environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos?tipo='+ tipo +'&desde=' + desde + '&hasta='+ hasta + '&identificacion=' + identificacion + '&ultimo=' + ultimo);

      }

  }
  
}