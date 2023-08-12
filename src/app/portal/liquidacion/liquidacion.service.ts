import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";

const envInst = environment.urlApi.concat('/instituciones/' + environment.idInstitucion + '/');

@Injectable()
export class LiquidacionService {
    constructor (private http: HttpClient, private datePipe: DatePipe) { }

    consultaOrdenes(
    idEstatus?:	number, 
    idLote?: number, 
    fechaRegistroDesde?: Date, 
    fechaRegistroHasta?: Date, 
    idBancoDestino?: number, 
    idMedioPago?: number, 
    idCuentaOrigen?: number, 
    moneda?: string, 
    ): Observable<any[]> {

        const endPoint = envInst + 'liquidacion/ordenPagos';
        let params = new HttpParams();
        
        if (idEstatus) {params = params.append('idEstatus', idEstatus.toString())}
        if (idLote) {params = params.append('idLote', idLote.toString())}
        if (idBancoDestino) {params = params.append('idBancoDestino', idBancoDestino.toString())}
        if (idMedioPago) {params = params.append('idMedioPago', idMedioPago.toString())}
        if (idCuentaOrigen) {params = params.append('idCuentaOrigen', idCuentaOrigen.toString())}
        if (fechaRegistroDesde) {
            params = params.append('fechaRegistroDesde', this.datePipe.transform(fechaRegistroDesde, 'yyyy-MM-dd'))
        }
        if (fechaRegistroHasta) {
            params = params.append('fechaRegistroHasta', this.datePipe.transform(fechaRegistroHasta, 'yyyy-MM-dd'))
        }
        if (moneda) {params = params.append('moneda', moneda.toString())}

        return this.http.get<any[]>(endPoint, {params: params})
    }

    consultaEstatusOrden(procesoManual?: number, activo?: number): Observable<any[]> {
        const endPoint = envInst + 'liquidacion/tipoEstatusOp';
        let params = new HttpParams();
        params = params.set('activo', activo ? activo.toString() : '1'); 
        if (procesoManual) {params = params.append('procesoManual', procesoManual.toString())}
        
        return this.http.get<any[]>(endPoint, {params:params});
    }

    consultaMediosPago(activo?: number): Observable<any[]> {
        const endPoint = envInst + 'liquidacion/mediosPago';
        let params = new HttpParams();
        params = params.set('activo', activo ? activo.toString() : '1'); 

        return this.http.get<any[]>(endPoint, {params:params});
    }

    consultaCuentasEmpresa(visible?: number): Observable<any[]> { 
        // luego en su propio modulo ?
        const endPoint = envInst + 'cuentasEmpresa';
        let params = new HttpParams();
        params = params.set('visible', visible ? visible.toString() : '1'); 

        return this.http.get<any[]>(endPoint, {params:params});
    }

    crearLote(idCuentaOrigen: number,idMedioPago: number, ordenPagoList: any[]) {
        const endPoint = envInst + 'liquidacion/crearLote';
        const body = {
            idCuentaOrigen: idCuentaOrigen,
            idMedioPago: idMedioPago,
            ordenPagoList: ordenPagoList, //{id: number}
        };
        var HTTPOptions = {
            observe: "response" as 'body',// to display the full response & as 'body' for type cast
            'responseType': 'blob' as 'json'
        }
        return this.http.post<HttpResponse<Blob>>(endPoint, body, HTTPOptions); // fileDownload
    }
}