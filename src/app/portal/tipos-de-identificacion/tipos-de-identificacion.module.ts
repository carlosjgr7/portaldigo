import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TiposDeIdentificacionService } from './tipos-de-identificacion.service';
import { DirectivesModule } from '../../shared/directives/directives.module';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,DirectivesModule
  ],
  exports: [
    DirectivesModule
  ],
  providers: [
    TiposDeIdentificacionService
  ]
})
export class TiposDeIdentificacionModule { }