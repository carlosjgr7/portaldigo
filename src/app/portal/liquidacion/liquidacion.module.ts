import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LiquidacionComponent } from './liquidacion.component';
import { LiquidacionService } from './liquidacion.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LiquidacionComponent
  ],
  providers: [
    LiquidacionService,
  ],
})
export class LiquidacionModule { }
