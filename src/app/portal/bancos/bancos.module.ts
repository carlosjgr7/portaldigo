import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BancosService } from './bancos.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    BancosService
  ]
})
export class BancosModule { }