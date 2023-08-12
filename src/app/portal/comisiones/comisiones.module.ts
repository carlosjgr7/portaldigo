import { NgModule } from '@angular/core';

import { ComisionesComponent } from './comisiones.component';
import { ActualizarComisionComponent } from './actualizar-comision/actualizar-comision.component';
import { SharedModule } from '../../shared/shared.module';
import { ComisionesService } from './comisiones.service';
import { AfiliadosService } from '../afiliados/afiliados.service';
import { DialogAfiliado } from './actualizar-comision/dialog-afiliado';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ComisionesComponent, 
    ActualizarComisionComponent,
    DialogAfiliado
  ],
  entryComponents:[DialogAfiliado],
  providers: [
    ComisionesService,
    AfiliadosService,
  ]
})
export class ComisionesModule { }
