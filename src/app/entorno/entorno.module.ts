import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

import { EntornoService } from "./entorno.service";
import { InicioSesionComponent } from "./inicio-sesion/inicio-sesion.component";
import { RestablecerPassComponent } from "./inicio-sesion/inicio-sesion.component";
import { PdfViewerModule } from "ng2-pdf-viewer";

@NgModule({
  declarations: [InicioSesionComponent, RestablecerPassComponent],
  entryComponents: [RestablecerPassComponent],
  imports: [HttpClientModule, SharedModule],
  exports: [InicioSesionComponent, RestablecerPassComponent],
  providers: [EntornoService],
})
export class EntornoModule {}
