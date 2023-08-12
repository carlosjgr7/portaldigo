import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';
import { EntornoService } from '../../entorno/entorno.service';

@Injectable()
export class UsuariosService {

  constructor (private http: HttpClient, private entornoService: EntornoService) {}

  getUsuarios ( filtro:string = null, ultimo:string = null ) {

    if ( filtro == null && ultimo == null ) {

      return this.http.get(
      environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios');

    }

    if ( filtro != null && ultimo == null ) {

      return this.http.get(
      environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios?filtro=' + filtro);

    }

    if ( filtro == null && ultimo != null ) {

      return this.http.get(
      environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios?ultimo=' + ultimo);

    }

    if ( filtro == null && ultimo == null ) {

      return this.http.get(
      environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios?filtro=' + filtro + '&ultimo=' + ultimo);

    }

  }

  getUsuario ( id: number) {

    return this.http.get(
      environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + id);

  }

  create ( usuario: any ) {

    const body = usuario;
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios', body, {
        observe: 'response'
    });

  }

  update ( usuario: any ) {

    const body = usuario;
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + usuario.id, body, {
        observe: 'response'
    });

  }

  borrar ( id:number ) {

    return this.http.delete(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + id, {
        observe: 'response'
    });

  }

  cambioClave ( clave: any ) {

    var auth:any = this.entornoService.auth();
    const body = clave;
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + auth.user.usuario + '/cambio-contrasena', body, {
        observe: 'response'
    });

  }

  reestablecerPassword ( user : any ) {
    const body : any = {
      canal : 1,
      contrasenaActual : user.clave,
      contrasenaNueva : user.clave1
    };
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + user.usuario + '/cambio-contrasena', body, {
      headers: new HttpHeaders({}),
        observe: 'response'
    });
  }

  roles () {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/roles');
  }

  reestablecerPasswordAdmin  ( id : number ) {

    const body : any = {};
    return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/'+id+'/restablecimiento-contrasena', body, {
      observe: 'response'
    });

  }

}