import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ActualizarOperadorasService } from './actualizar.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ActualizarOperadorasService
  ]
})
export class ActualizarOperadorasModule { }