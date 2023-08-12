import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ActualizarParametrosService } from './actualizar.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ActualizarParametrosService
  ]
})
export class ActualizarParametrosModule { }