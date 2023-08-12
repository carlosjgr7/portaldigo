import { Injectable }from '@angular/core';
import { HttpClient }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';

@Injectable()
export class DigitelService 
{
    constructor (private http: HttpClient) {}

    getRecargaDetalle ( id:number) 
    { 
        return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/detalleRecarga/'+ id);    
    }

    getRecargas (tipoTransaccion: string,
        desde:string, 
        hasta:string,
        telefonoEmisor: string = null,
        telefonoReceptor: string = null,
        ultimo: number = null) 
        {

            if (telefonoEmisor != null && telefonoReceptor != null && ultimo != null)
            {
                return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/recargas_digitel?tipoTransaccion='+ tipoTransaccion +'&desde=' + desde + '&hasta='+ hasta + '&numeroOrigen=' + telefonoEmisor + '&numeroDestino=' + telefonoReceptor + '&ultimo=' + ultimo);
            }
            if (telefonoEmisor == null && telefonoReceptor != null && ultimo != null)
            {
                return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/recargas_digitel?tipoTransaccion='+ tipoTransaccion +'&desde=' + desde + '&hasta='+ hasta + '&numeroDestino=' + telefonoReceptor + '&ultimo=' + ultimo);
            }
            if (telefonoEmisor == null && telefonoReceptor == null && ultimo != null)
            {
                return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/recargas_digitel?tipoTransaccion='+ tipoTransaccion +'&desde=' + desde + '&hasta='+ hasta + '&ultimo=' + ultimo);
            }
            if (telefonoEmisor == null && telefonoReceptor == null && ultimo == null)
            {
                return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/recargas_digitel?tipoTransaccion='+ tipoTransaccion +'&desde=' + desde + '&hasta='+ hasta);
            }
        }
        
    getParametros(tipoTransaccion: string)
    {
        return this.http.get(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/pagos/parametros_digitel?tipoTransaccion='+ tipoTransaccion);
    }
}