import { NgModule } from '@angular/core';

import { RolesUsuariosComponent } from './roles-usuarios.component';
import { SharedModule } from '../../shared/shared.module';
import { RolesUsuariosService } from './roles-usuarios.service';
import { DetalleRolUsuarioComponent } from './detalle-rol-usuario/detalle-rol-usuario.component';

/** Módulo de Roles y Usuarios
 * 
 * Autor: Luis Carlos Marval <lmarval@fin-soft.net> */
@NgModule({
  declarations: [
    RolesUsuariosComponent,
    DetalleRolUsuarioComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    RolesUsuariosService,
  ]
})
export class RolesUsuariosModule { }
