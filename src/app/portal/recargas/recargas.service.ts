import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";

const envInst = environment.urlApi.concat('/instituciones/' + environment.idInstitucion + '/');

@Injectable()
export class RecargasService {

    constructor (private http: HttpClient, private datePipe: DatePipe) { }

    consultaRecargas(
    desde: Date, 
    hasta: Date,  
    idEstatusRecarga?: number, 
    idMedioCarga?: number, 
    idBancoOrigen?: number, 
    idBancoDestino?: number,
    ): Observable<any[]> {
         
        const endPoint = envInst + 'recargas';
        let params = new HttpParams();
        params = params.set('fechaDesdeRecarga', this.datePipe.transform(desde, 'yyyy-MM-dd'))
                        .set('fechaHastaRecarga', this.datePipe.transform(hasta, 'yyyy-MM-dd'));
                        
        if (idEstatusRecarga != undefined) { params = params.append('idEstatusRecarga', idEstatusRecarga.toString())}
        if (idMedioCarga != undefined) { params = params.append('idMedioCarga', idMedioCarga.toString())}
        if (idBancoOrigen != undefined) { params = params.append('idBancoOrigen', idBancoOrigen.toString())}
        if (idBancoDestino != undefined) { params = params.append('idBancoDestino', idBancoDestino.toString())}
      
        return this.http.get<any[]>(endPoint, {params:params});
    }

    consultaMediosCarga(): Observable<any[]> {
        const endPoint = envInst + 'mediosRecarga';
        let params = new HttpParams();
        params = params.set('activo', '1');
      
        return this.http.get<any[]>(endPoint, {params:params});
    }

    consultaEstatusRecarga(): Observable<any[]> {
        const endPoint = envInst + 'tipoEstatusRecarga';
        let params = new HttpParams();
        params = params.set('activo', '1');
      
        return this.http.get<any[]>(endPoint, {params:params});
    }

    conciliarExtractoRecarga(idExtracto: number, idRecarga?: number) {
        const endPoint = envInst + 'conciliacion/extractoBancarioRecarga';
        let body = {
            id: idExtracto,
            idRecarga: idRecarga ? idRecarga : null
        };
      
        return this.http.post<any[]>(endPoint, body);
    }
}