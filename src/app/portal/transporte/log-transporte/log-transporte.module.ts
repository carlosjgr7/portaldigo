import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LogTransporteService } from './log-transporte.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    LogTransporteService
  ]
})
export class PalabrasReservadasModule { }