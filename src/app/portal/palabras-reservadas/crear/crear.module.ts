import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CrearPalabrasReservadasService } from './crear.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule, SharedModule
  ],
  exports: [
  ],
  providers: [
    CrearPalabrasReservadasService
  ]
})
export class CrearPalabrasReservadasModule { }