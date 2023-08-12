import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EventosService } from './eventos.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    EventosService
  ]
})
export class EventosModule { }