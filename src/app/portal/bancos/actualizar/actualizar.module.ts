import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ActualizarBancosService } from './actualizar.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ActualizarBancosService
  ]
})
export class ActualizarBancosModule { }