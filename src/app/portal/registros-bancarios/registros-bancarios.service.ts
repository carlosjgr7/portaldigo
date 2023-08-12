import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";

const envInst = environment.urlApi.concat('/instituciones/' + environment.idInstitucion + '/');

@Injectable()
export class RegistrosBancariosService {

    constructor (private http: HttpClient, private datePipe: DatePipe) { }

    consultaExtractosBancarios(
    desde: Date, 
    hasta: Date, 
    idBanco?: number, 
    referencia?: number, 
    descripcion?: string, 
    tipoEstatusConciliaMov?: number,
    idMoneda?: number,
    ): Observable<any[]> {

        const endPoint = envInst + 'conciliacion/extractosBancarios';
        let params = new HttpParams();
        params = params.set('fechaDesde', this.datePipe.transform(desde, 'yyyy-MM-dd'))
                       .set('fechaHasta', this.datePipe.transform(hasta, 'yyyy-MM-dd')) 
                       
        if (tipoEstatusConciliaMov) { 
            params = params.append('tipoEstatusConciliaMov', tipoEstatusConciliaMov.toString())
        }
        if (idBanco) { params = params.append('idBanco', idBanco.toString())}
        if (idMoneda) { params = params.append('idMoneda', idMoneda.toString())}
        if (referencia) { params = params.append('referencia', referencia.toString())}
        if (descripcion) { params = params.append('tipoMovBancario', descripcion)}

        return this.http.get<any[]>(endPoint, {params: params});
    }

    registrarExtractoIndividual(
    idBanco: number, 
    referencia: number, 
    descripcion: string, 
    monto: any, 
    fechaCarga: Date, 
    moneda?: string
    ): Observable<any[]> {
    
        const endPoint = envInst + 'conciliacion/extractoBancario';
        let body = {
            fecha: this.datePipe.transform(fechaCarga, 'yyyy-MM-dd'),
            referencia: referencia.toString(),
            idBanco: idBanco.toString(),
            descripcion: descripcion,
            monto: monto.toString(),
            idMoneda: moneda ? moneda : 'VES'
        };
        console.log(body)
        return this.http.post<any[]>(endPoint, body);
    }
    
    cargaMasivaExtractosBancarios(idBanco: number, archivo: File) {

        const endPoint = envInst + 'conciliacion/extractosBancarios';
        let params = new HttpParams();
        params = params.set('idBanco', idBanco.toString());
        let formData: FormData = new FormData();
        formData.append('file', archivo, archivo.name);
                // .set('Content-Type', 'application/multipart/form-data'); Esta linea generaba error en la subida
     
        return this.http.post<any[]>(endPoint, formData, {params:params});
    }

    consultaTipoExtractosBancarios(activo?: number): Observable<any[]> {
        const endPoint = envInst + 'conciliacion/tipoEstatusMovBancarios';
        let params = new HttpParams();
        params = params.set('activo', activo ? activo.toString() : '1');

        return this.http.get<any[]>(endPoint, {params:params});
    }
}