import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ActualizarPalabrasReservadasService } from './actualizar.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ActualizarPalabrasReservadasService
  ]
})
export class ActualizarPalabrasReservadasModule { }