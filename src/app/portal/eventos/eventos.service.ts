import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';

@Injectable()
export class EventosService {

  constructor (private http: HttpClient) {}

  getAcciones () {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos/acciones');
  }

  getCanales () {
    return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/canales');
  }

  getEventos ( desde: string, 
			  	hasta:string, 
			  	usuario:string = null, 
			  	canal:string = null,
			  	accion:string = null,
          ultimo:number = null,
          excel: boolean = false) {

    //todos los valores seteados



    if ( usuario != null && canal != null && accion != null && ultimo != null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&usuario='+ usuario +'&canal=' + canal +'&accion=' + accion +'&ultimo=' + ultimo +'&exportar=' + excel);

    }

    //todos los valores nulos o por defecto

    if ( usuario == null && canal == null && accion == null && ultimo == null ) {


    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&exportar=' + excel);

    }

    //solo usuario seteado

    if ( usuario != null && canal == null && accion == null && ultimo == null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&usuario='+ usuario +'&exportar=' + excel);

    }

    //solo usuario y canal seteado

    if ( usuario != null && canal != null && accion == null && ultimo == null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&usuario='+ usuario+'&canal='+ canal +'&exportar=' + excel);

    }

    //solo usuario y accion seteado

    if ( usuario != null && canal == null && accion != null && ultimo == null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&usuario='+ usuario+'&accion='+ accion +'&exportar=' + excel);

    }

    //solo usuario y accion seteado

    if ( usuario != null && canal == null && accion == null && ultimo != null ) {

        return this.http.get(
        environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&usuario='+ usuario+'&ultimo='+ ultimo +'&exportar=' + excel);

    }

    //solo canal seteado

    if ( usuario == null && canal != null && accion == null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&canal='+ canal +'&exportar=' + excel);

    }

    //solo canal y accion seteado

    if ( usuario == null && canal != null && accion != null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&canal='+ canal+'&accion='+ accion +'&exportar=' + excel);

    }

    if ( usuario == null && canal != null && accion == null && ultimo != null ) {

        return this.http.get(
        environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&canal='+ canal+'&ultimo='+ ultimo +'&exportar=' + excel);

    }

    //solo accion seteado

    if ( usuario == null && canal == null && accion != null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&accion='+ accion +'&exportar=' + excel);

    }

    if ( usuario == null && canal == null && accion == null && ultimo != null ) {

        return this.http.get(
        environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&ultimo='+ ultimo +'&exportar=' + excel);

    }

    
    if ( usuario != null && canal != null && accion != null && ultimo == null ) {

    	return this.http.get(
    	environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos?desde=' + desde + '&hasta='+ hasta +'&usuario='+ usuario +'&canal=' + canal +'&accion=' + accion  +'&exportar=' + excel);

    }

  }

  getEvento ( id:number ) {
    return this.http.get(
        environment.urlApi + '/instituciones/' + environment.idInstitucion + '/eventos/' + id);
  }
  
}