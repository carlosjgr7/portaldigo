import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ParametrosService } from './parametros.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    ParametrosService
  ]
})
export class ParametrosModule { }