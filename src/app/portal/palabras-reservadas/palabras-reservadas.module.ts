import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PalabrasReservadasService } from './palabras-reservadas.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    PalabrasReservadasService
  ]
})
export class PalabrasReservadasModule { }