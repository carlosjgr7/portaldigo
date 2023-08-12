import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { UsuariosService } from './usuarios.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    UsuariosService
  ]
})
export class UsuariosModule { }