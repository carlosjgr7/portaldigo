import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CrearBancosService } from './crear.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule, SharedModule
  ],
  exports: [
  ],
  providers: [
    CrearBancosService
  ]
})
export class CrearBancosModule { }