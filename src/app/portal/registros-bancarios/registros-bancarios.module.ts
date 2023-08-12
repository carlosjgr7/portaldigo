import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";
import { RegistrosBancariosComponent } from "./registros-bancarios.component";
import { RegistrosBancariosService } from "./registros-bancarios.service";

@NgModule({
    declarations: [
      RegistrosBancariosComponent
    ],
    imports: [
      SharedModule
    ],
    exports: [
    ],
    providers: [
      RegistrosBancariosService,
    ],
  })
  export class RegistrosBancariosModule { }