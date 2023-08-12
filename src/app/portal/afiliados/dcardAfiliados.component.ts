import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { NgModule } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { EntornoService } from "../../entorno/entorno.service";
import { AfiliadosService } from "./afiliados.service";
import { DialogService } from "../../shared/dialogs/dialog.service";
import { SubjectsService } from "../../shared/subjects/subjects";
import { VisualizarArchivoDialogComponent } from "../../shared/dialogs/visualizar-archivo-dialog/visualizar-archivo-dialog.component";
import { AlertDialogComponent } from "../../shared/dialogs/alert-dialog/alert-dialog.componetn";
import { InformacionFinancieraDialogComponent } from "../../shared/dialogs/informancion-financiera-dialog/informacion-financiera-dialog.component";
import { ListaRecaudosDialogComponent } from "../../shared/dialogs/lista-recaudos-dialog/lista-recaudos-dialog.component";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { ConfirmationDialogComponent } from "../../shared/dialogs/confirmation-dialog/confirmation-dialog.component";
import { ThrowStmt } from "@angular/compiler";

var element_data: any = [];

@Component({
  selector: "app-detalle",
  templateUrl: "./dcardAfiliados.component.html",
  styleUrls: ["./afiliados.component.scss"],
  providers: [AfiliadosService],
})
export class DcardAfiliadoComponent implements OnInit {
  constructor(
    private ref: ChangeDetectorRef,
    private entornoService: EntornoService,
    private router: Router,
    private service: AfiliadosService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private subjectsService: SubjectsService
  ) {}

  private id: any = this.route.snapshot.params["id"];

  public global_alert = this.entornoService.pivot_msg;

  public esUnico: boolean = false;

  @ViewChild("listaEstatus") listaEstatus;
  @ViewChild("listaAci") listaAci;

  public afiliado: any;

  public actividades: any[];
  public categorias: any[];
  public subCategorias: any[];

  public permisos: boolean;
  public permisosBloqueoCarnet: boolean;
  public permisosDesactivarServicio: boolean;

  public auth: any = this.entornoService.auth();

  public cuentas: any[];

  public noModificado: boolean = false;

  public keyword = "descripcion";

  public recaudos = [];
  public archivoValidado;
  public pdfViewerActive = "";

  public sexoPersona = "";

  public loading: boolean = true;

  public gestiones: any;

  ngOnInit() {
    this.loading = true;

    this.service.getGestiones(this.route.snapshot.params["id"]).subscribe(
      (response) => {
        console.log(response);
        this.loading = false;
        this.gestiones = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
