import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { OperadorasService } from './operadoras.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    OperadorasService
  ]
})
export class OperadorasModule { }