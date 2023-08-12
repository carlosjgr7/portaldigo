import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PagosService } from './pagos.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    PagosService
  ]
})
export class PagosModule { }