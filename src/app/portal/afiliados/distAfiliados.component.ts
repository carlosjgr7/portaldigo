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

import { AlertDialogComponent } from "../../shared/dialogs/alert-dialog/alert-dialog.componetn";
import { DcardDistribucionDialogComponent } from "../../shared/dialogs/dcard-distribucion-dialog/dcard-distribucion-dialog.component";

var element_data: any = [];

@Component({
  selector: "app-detalle",
  templateUrl: "./distAfiliados.component.html",
  styleUrls: ["./afiliados.component.scss"],
  providers: [AfiliadosService],
})
export class DistAfiliadoComponent implements OnInit {
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

    (<HTMLInputElement>document.getElementById("cod")).focus();

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

  guardar() {
    const cod: any = (<HTMLInputElement>document.getElementById("cod")).value;

    if (cod === "") {
      this.dialog.open(AlertDialogComponent, {
        data: {
          title: "ALERTA",
          message: "Debe colocar un Cod de Tarjeta",
          yes: "Aceptar",
        },
      });
      return;
    }

    this.service
      .distriDcard(cod, this.entornoService.auth()["user"].id)
      .subscribe(
        (res: any) => {
          (<HTMLInputElement>document.getElementById("cod")).value = "";

          this.dialog
            .open(DcardDistribucionDialogComponent, {
              width: "600px",
              data: {
                title: "Distribucion",
                dcard: { id: res.id },
                staPan: {},
                afiliado: { id: res.id_usuario, usuario: res.usuario },
                mensajeBoton: "Cancelar",
              },
            })
            .afterClosed()
            .subscribe((result) => {});
        },
        (err) => {
          //console.log(err);
          this.dialog
            .open(AlertDialogComponent, {
              data: {
                title: "ERROR!",
                message: err.error.mensaje,
                yes: "Aceptar",
              },
            })
            .afterClosed();
          (<HTMLInputElement>document.getElementById("cod")).value = "";
        }
      );
  }
}
