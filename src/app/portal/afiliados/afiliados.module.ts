import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AfiliadosService } from './afiliados.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    AfiliadosService
  ]
})
export class AfiliadosModule { }