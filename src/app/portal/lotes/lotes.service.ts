import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";

const envInst = environment.urlApi.concat('/instituciones/' + environment.idInstitucion + '/');

@Injectable()
export class LotesService {
    constructor (private http: HttpClient, private datePipe: DatePipe) { }
    
    consultaEstatusLote(activo?: number): Observable<any[]> {
        const endPoint = envInst + 'liquidacion/tipoEstatusLote';
        let params = new HttpParams();
        params = params.set('activo', activo ? activo.toString() : '1'); 

        return this.http.get<any[]>(endPoint, {params:params});
    }

    consultaLotes(
    idLote?: number, 
    idCuentaOrigen?: number, 
    fechaProcesoDesde?: Date, 
    fechaProcesoHasta?: Date, 
    estatus?: number
    ): Observable<any[]> {
        
        const endPoint = envInst + 'liquidacion/lotes';
        let params = new HttpParams();
        if (idLote != undefined) {
            params = params.append('idLote', idLote.toString());
        }
        if (idCuentaOrigen != undefined) {
            params = params.append('idCuentaOrigen', idCuentaOrigen.toString());
        }
        if (fechaProcesoDesde != undefined) { // revisar luego
            params = params.set('fechaProcesoDesde',  this.datePipe.transform(fechaProcesoDesde, 'yyyy-MM-dd'));
        }
           if (fechaProcesoHasta != undefined) { // revisar luego
            params = params.set('fechaProcesoHasta', this.datePipe.transform(fechaProcesoHasta, 'yyyy-MM-dd'));
        } 
        if (estatus != undefined) {
            params = params.append('estatus', estatus.toString());
        }

        return this.http.get<any[]>(endPoint, {params: params});
    }

    obtenerArchivoLote(idLote: number) {
        const endPoint = envInst + 'liquidacion/obtenerArchivoLote';
        let params = new HttpParams();
        var HTTPOptions = {
            params: params.set('idLote', idLote.toString()), 
            observe: "response" as 'body',// to display the full response & as 'body' for type cast
            'responseType': 'blob' as 'json'
        }
       
        return this.http.get<HttpResponse<Blob>>(endPoint, HTTPOptions);
    }

    procesarLote(idLote: number, ordenPagoList: any[]) {
        const endPoint = envInst + 'liquidacion/procesarLote';
        let body = {
            id: idLote,
            ordenPagoList: ordenPagoList
        }

        return this.http.post(endPoint, body);
    } 
}