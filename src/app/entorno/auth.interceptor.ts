import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EntornoService } from "./entorno.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private entornoService: EntornoService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/inicio-sesion') || request.url.endsWith('/cierre-sesion')) {
      return next.handle(request);
    }

    var auth:any = this.entornoService.auth();
    
    if (auth.auth) {
      request = request.clone({
        setHeaders: {
          'X-Auth-Token': auth.user.token
        }
      });
    }

    return next.handle(request).catch(error => this.handleError(error));
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401 || error.status === 403) {
      this.entornoService.cerrarSesion();
      return Observable.of(error.message);
    }

    return Observable.throw(error);
  }

}