import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";

const envInst = environment.urlApi.concat('/instituciones/' + environment.idInstitucion + '/');

@Injectable()
export class ComisionesService {

    constructor (private http: HttpClient, private datePipe: DatePipe) { }

    createComision(body)    {
        return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comision', body)
    }

    findComisions(id, tipoTransacciom, activa, tipoPersona, tipoOperacion)    {

        let params = new HttpParams();

        if (id) {
          params = params.set('id', id.toString());
        }
        if (tipoTransacciom) {
          params = params.set('tipoTran', tipoTransacciom.toString());
        }
        if (activa != undefined) {
          params = params.set('activa', activa.toString());
        }
        if (tipoPersona) {
          params = params.set('tipoPersona', tipoPersona.toString());
        }
        if (tipoOperacion) {
          params = params.set('tipoOperacion', tipoOperacion.toString());
        }

        return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comision', {params : params})
    }

    createComisionActEco(body)    {
      return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comisionActEconomica', body)
    }

    findComisionsActEco(id, tipoTransacciom, activa, tipoPersona, tipoOperacion, idActEco)    {

        let params = new HttpParams();

        if (id) {
          params = params.set('id', id.toString());
        }
        if (idActEco) {
          params = params.set('idActEco', idActEco.toString());
        }
        if (tipoTransacciom) {
          params = params.set('tipoTran', tipoTransacciom.toString());
        }
        if (activa != undefined) {
          params = params.set('activa', activa.toString());
        }
        if (tipoPersona) {
          params = params.set('tipoPersona', tipoPersona.toString());
        }
        if (tipoOperacion) {
          params = params.set('tipoOperacion', tipoOperacion.toString());
        }

        return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comisionActEconomica', {params : params})
      }
      
    createComisionAfiliado(body)    {
      return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comisionAfiliado', body)
    }

    updateComisionAfiliado(body)    {
      return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comisionAfiliados', body, { observe: 'response'})
    }
    
    findComisionAfiliado(id, idAfiliado, tipoTransacciom, tipoValor, tipoPersona, tipoOperacion)    {
      
      let params = new HttpParams();
      
      if (id) {
        params = params.append('id', id.toString());
      }
      if (idAfiliado) {
        params = params.append('idAfiliado', idAfiliado.toString());
      }
      if (tipoTransacciom) {
        params = params.append('tipoTransaccion', tipoTransacciom.toString());
      }
      if (tipoValor != undefined) {
        params = params.append('tipoValor', tipoValor.toString());
      }
      if (tipoPersona) {
        params = params.append('tipoPersona', tipoPersona.toString());
      }
      if (tipoOperacion) {
        params = params.append('tipoOperacion', tipoOperacion.toString());
      }
      
      return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/comisionAfiliado', {params : params})
    }
    
    findTiposTransaccion() {
      let params = new HttpParams();      
      params = params.append('activa', '1')
                      .append('generaComision', '1');

      return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/tipoTransaccion', {params : params})
    }

    findTiposActividadesEconomicas() {
      return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/actividades')
    }

    findAfiliados(tipoPersona){
      let params = new HttpParams();      
      params = params.append('tipo', tipoPersona.toString());
      return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/afiliados', {params:params})
    }

    createComisionInfo(comisionInfo: any) {
      localStorage.setItem('comisionInfo', JSON.stringify(comisionInfo));
    }

    deleteComisionInfo() {
      localStorage.removeItem('comisionInfo');
    }

    getComisionInfo(): any {
      let comisionInfo = localStorage.getItem('comisionInfo');
      if (comisionInfo != undefined) {
        comisionInfo = JSON.parse(comisionInfo);
      }

      return comisionInfo;
    }

  }