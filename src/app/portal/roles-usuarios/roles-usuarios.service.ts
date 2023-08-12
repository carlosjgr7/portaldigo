import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { EntornoService } from '../../entorno/entorno.service';

@Injectable({
    providedIn: 'root'
  })
export class RolesUsuariosService
{
    constructor(private http: HttpClient, private entornoService: EntornoService) { }

    loadUsuarios(filtro?: string): Observable<any[]> {
        let params = new HttpParams();
        if (filtro) { params = params.append('filtro', filtro) }
        //return this.http.get<any[]>(`${environment.urlApi}/usuarios`, {params: params});
        return this.http.get<any[]>(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios', {params: params});
        
    }

    consultaUsuario(id: number) : Observable<any> {
        //return this.http.get<any>(`${environment.urlApi}/usuarios/${id}`);

        return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + id);
    }
    
    consultaTiposUsuarios(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.urlApi}/usuarios/tipoUsuario`);
    }

    loadRoles(filtro?: string): Observable<any[]> {
        let params = new HttpParams();
        if (filtro) { params = params.append('filtro', filtro) }
        //return this.http.get<any[]>(`${environment.urlApi}/usuarios/roles`, {params: params});
        return this.http.get<any[]>(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/roles');
    }

    consultaRolesPorId(id: number): Observable<any> {
        return this.http.get<any>(environment.urlApi + '/instituciones/' + environment.idInstitucion +'/usuarios/roles/' + id);
    }

    consultaRolPorId(id: number): Observable<any> {
        return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion +'/usuarios/rol/' + id);
    }

    consultaOpcionesMenu(activo?: number): Observable<any[]> {
        let params = new HttpParams();
        if (activo) { params = params.append('activo', activo.toString()) }
        //return this.http.get<any[]>(`${environment.urlApi}/usuarios/opciones`, {params: params});
        return this.http.get<any[]>(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/opciones',{params: params});
    }

    consultaOpcionesAccionesDeMenu(id: number, activo?: number) {
        let params = new HttpParams();
        params = params.set('idOpcionMenu', id.toString())
        if (activo) { params = params.append('activo', activo.toString()) }
        return this.http.get<any[]>(environment.urlApi + '/instituciones/' + environment.idInstitucion +'/usuarios/opcionAcciones', {params: params});
    }

    /** Función para crear o modificar rol, si se modifica se pasa id  */
    crearModificarRol(nombre: string, descripcion: string, estatus: number, idTipoUsuario: number, 
        opcionMenuRolList: {idOpcionMenu: number, activo: number, opcionMenuRolAccionList: {idAccion: number, activo: number}[]}[]|any[], 
        tipoRol:number, id?: number) {
        let body = {
            id: id != undefined ? id : undefined,
            nombre: nombre,
            descripcion: descripcion,
            estatus: estatus,
            idTipoUsuario: idTipoUsuario,
            tipo: tipoRol,
            opcionMenuRolList: opcionMenuRolList,
        };
        return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion +'/usuarios/crear-modificar-rol', body);
    }

    rolCacheClean(name: string) {
        let params = new HttpParams();
        params = params.set('cacheName', name);
        return this.http.post(`${environment.urlApi}/clearCache`, null, {params: params});
    }

    crearUsuario(login: string, nombre: string, email: string, 
        estatus: boolean, cambioClave: number, idTipoUsuario: number, clave: string, rolList: {id: number, activo: number}[]) {
        let body = {
            login: login,
            nombre: nombre,
            email: email,
            estatus: estatus == true ? 'A': 'I',
            cambioClave: cambioClave,
            idTipoUsuario: idTipoUsuario,
            clave: clave,
            rolList: rolList,
        };
        return this.http.post(`${environment.urlApi}/usuarios`, body);
    }

    modificarUsuario(id: number, login: string, nombre: string, email: string, 
        estatus: boolean, cambioClave: number, idTipoUsuario: number, clave: string, rolList: {id: number, activo: number}[]|any[]) {
        let body = {
            login: login,
            nombre: nombre,
            email: email,
            estatus: estatus == true ? 'A': 'I',
            cambioClave: cambioClave,
            idTipoUsuario: idTipoUsuario,
            clave: clave,
            rolList: rolList,
        };
        return this.http.post(`${environment.urlApi}/usuarios/${id}`, body)
    }

    reestablecerPasswordAdmin  ( id : number ) {

        const body : any = {};
        return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/'+id+'/restablecimiento-contrasena', body, {
          observe: 'response'
        });
    
      }

      update ( usuario: any ) {

        const body = usuario;
        return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + usuario.id, body, {
            observe: 'response'
        });
    
      }

      createUser ( usuario: any ) {

        const body = usuario;
        return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios', body, {
            observe: 'response'
        });
    
      }

      borrar ( id:number ) {

        return this.http.delete(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/usuarios/' + id, {
            observe: 'response'
        });
    
      }

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
    
}