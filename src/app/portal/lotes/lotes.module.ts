import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LotesComponent } from './lotes.component';
import { LotesService } from './lotes.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [LotesComponent],
  providers: [LotesService],
})
export class LotesModule { }
