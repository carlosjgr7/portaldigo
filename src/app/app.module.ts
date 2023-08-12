import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  LocationStrategy,
  PathLocationStrategy,
  registerLocaleData,
} from "@angular/common";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import locale from "@angular/common/locales/es-VE";

import { AppRoutingModule } from "./app-routing.module";
import { EntornoModule } from "./entorno/entorno.module";
import { SharedModule } from "./shared/shared.module";
import { AuthInterceptor } from "./entorno/auth.interceptor";
import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";
import { NgxImageZoomModule } from "ngx-image-zoom";
import { RolesUsuariosComponent } from "./portal/roles-usuarios/roles-usuarios.component";
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

registerLocaleData(locale, "es-VE");

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EntornoModule,
    SharedModule,
    NgxImageZoomModule.forRoot(),
    //NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
