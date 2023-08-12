import { NgModule } from '@angular/core';

import { RecargasComponent } from './recargas.component';
import { RecargasService } from './recargas.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        RecargasComponent,
    ],
    imports: [
        SharedModule,
    ],
    providers: [
        RecargasService,
    ],
})
export class RecargasModule {}