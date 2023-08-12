import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ActualizarTipoDeIdentificacionService } from './actualizar.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ActualizarTipoDeIdentificacionService
  ]
})
export class ActualizarTipoDeIdentificacionModule { }