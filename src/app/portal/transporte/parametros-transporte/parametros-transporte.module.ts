import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ParametrosTransporteService } from './parametros-transporte.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ParametrosTransporteService
  ]
})
export class PalabrasReservadasModule { }