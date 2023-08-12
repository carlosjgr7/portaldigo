import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../table/table.module";
import { CompletedDialogComponent } from "./completed-dialog/completed-dialog.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { TableDialogComponent } from "./table-dialog/table-dialog.component";
import { DialogService } from "./dialog.service";
import { VisualizarArchivoDialogComponent } from "./visualizar-archivo-dialog/visualizar-archivo-dialog.component";
import { InformacionFinancieraDialogComponent } from "./informancion-financiera-dialog/informacion-financiera-dialog.component";
import { DcardDialogComponent } from "./dcard-dialog/dcard-dialog.component";
import { DcardGestionesDialogComponent } from "./dcard-gestiones-dialog/dcard-gestiones-dialog.component";
import { DcardDistribucionDialogComponent } from "./dcard-distribucion-dialog/dcard-distribucion-dialog.component";
import { DcardRecepDialogComponent } from "./dcard-recep-dialog/dcard-recep-dialog.component";
import { DcardActivacionDialogComponent } from "./dcard-activacion-dialog/dcard-activacion-dialog.component";
import { DcardBloqueoDialogComponent } from "./dcard-bloqueo-dialog/dcard-bloqueo-dialog.component";
import { DcardPerdidaDialogComponent } from "./dcard-perdida-dialog/dcard-perdida-dialo.component";
import { DcardRoboDialogComponent } from "./dcard-robo-dialog/dcard-robo-dialog.component";
import { DcardDeterioroDialogComponent } from "./dcard-deterioro-dialog/dcard-deterioro-dialog.component";
import { DcardVerGeneralDialogComponent } from "./dcard-vergeneral-dialog/dcard-vergeneral-dialog.component";
import { DcardGeneralDialogComponent } from "./dcard-general-dialog/dcard-general-dialog.component";
import { ListaRecaudosDialogComponent } from "./lista-recaudos-dialog/lista-recaudos-dialog.component";
import { PdfViewerComponent, PdfViewerModule } from "ng2-pdf-viewer";
import { NgxImageZoomComponent, NgxImageZoomModule } from "ngx-image-zoom";
import { AlertDialogComponent } from "./alert-dialog/alert-dialog.componetn";

@NgModule({
  declarations: [
    CompletedDialogComponent,
    ConfirmationDialogComponent,
    AlertDialogComponent,
    VisualizarArchivoDialogComponent,
    InformacionFinancieraDialogComponent,
    DcardDialogComponent,
    DcardGestionesDialogComponent,
    DcardDistribucionDialogComponent,
    DcardRecepDialogComponent,
    DcardActivacionDialogComponent,
    DcardBloqueoDialogComponent,
    DcardPerdidaDialogComponent,
    DcardRoboDialogComponent,
    DcardDeterioroDialogComponent,
    DcardGeneralDialogComponent,
    DcardVerGeneralDialogComponent,
    ListaRecaudosDialogComponent,
    TableDialogComponent,
    CompletedDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TableModule,
    PdfViewerModule,
    NgxImageZoomModule,
  ],
  exports: [
    CompletedDialogComponent,
    FormsModule,
    ConfirmationDialogComponent,
    AlertDialogComponent,
    VisualizarArchivoDialogComponent,
    InformacionFinancieraDialogComponent,
    DcardDialogComponent,
    DcardGestionesDialogComponent,
    DcardDistribucionDialogComponent,
    DcardRecepDialogComponent,
    DcardActivacionDialogComponent,
    DcardBloqueoDialogComponent,
    DcardPerdidaDialogComponent,
    DcardVerGeneralDialogComponent,
    DcardDeterioroDialogComponent,
    DcardGeneralDialogComponent,
    DcardRoboDialogComponent,
    ListaRecaudosDialogComponent,
    TableDialogComponent,
    CompletedDialogComponent,
    PdfViewerComponent,
    NgxImageZoomComponent,
  ],
  providers: [DialogService],
})
export class DialogModule {}
