import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { MessageService, Message } from "../message/message.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private messageService: MessageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).catch(error => this.handleError(error));
    }

    handleError(errorResponse: HttpErrorResponse): Observable<any> {
        let status = errorResponse.status;

        if (status === 0 || status === 502 || status === 503 || status === 504) {
            this.messageService.updateMessage({
                class: 'alert-danger',
                text: 'Servicio no disponible. Por favor intenta más tarde.'
            });
        }

        if (status === 400 || status === 500) {
            let message: Message = {
                class: 'alert-danger',
                text: 'Ocurrio un error deconocido en el servidor. Por favor intenta más tarde.'
            };

            if ( errorResponse.error != undefined && errorResponse.error['mensaje']) {
                message.text = errorResponse.error['mensaje'];
            }
            
            this.messageService.updateMessage(message);
        }

        return Observable.throw(errorResponse);
    }

}