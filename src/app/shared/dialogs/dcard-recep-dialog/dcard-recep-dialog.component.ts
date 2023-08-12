import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogService } from "../dialog.service";
import { AlertDialogComponent } from "../alert-dialog/alert-dialog.componetn";
import * as moment from "moment";
import { EntornoService } from "../../../entorno/entorno.service";

import { AfiliadosService } from "../../../portal/afiliados/afiliados.service";

@Component({
  selector: "dcard-recep-dialog",
  templateUrl: "dcard-recep-dialog.component.html",
  providers: [AfiliadosService],
})
export class DcardRecepDialogComponent {
  public title: string;
  public yesOption: string;
  public width: string;
  public height: string;
  public cuentas: any[];
  public tipoPersona: string;

  public dcard: any[];
  public staPan: any[];
  public afiliado: any[];

  public gestiones: any[];

  public loading: boolean = true;

  public fecha: string;
  public monto: string;

  public disabledButtonA: boolean = false;

  @ViewChild("listaAci") listaAci;
  public tipo_envio: any;
  public selected_tEnv;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DcardRecepDialogComponent>,
    private service: AfiliadosService,
    public dialog: MatDialog,
    private entorno: EntornoService
  ) {
    this.service.getCourrier().subscribe(
      (res: any) => {
        this.tipo_envio = res;
      },
      (err) => {
        console.log(err);
      }
    );

    dialogRef.disableClose = true;
    this.title = data.title;
    this.yesOption = data.mensajeBoton;
    this.cuentas = data.cuentas;
    this.tipoPersona = data.tipoPersona;

    this.dcard = data.dcard;
    this.staPan = data.staPan;
    this.afiliado = data.afiliado;

    this.fecha = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    //console.log(this.dcard, this.afiliado);
    // this.monto = new Intl.NumberFormat("de-DE", {
    //   minimumFractionDigits: 2,
    // }).format(parseFloat(this.dcard["saldo_disponible"]));

    this.service.getGestion(this.afiliado["id"]).subscribe(
      (res: any) => {
        this.loading = false;
        this.gestiones = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onClick(option: number) {
    this.dialogRef.close(option);
  }

  onGestiones() {}

  guardar() {
    this.disabledButtonA = true;
    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: "GUARDAR",
          message: "No podrá deshacer esta opción",
          yes: "Aceptar",
          no: "Cancelar",
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 1) {
          this.service
            .recepDcardS(this.dcard["id"], this.entorno.auth()["user"].id)
            .subscribe(
              (res: any) => {
                //console.log(res);
                //window.location.replace("portal/afiliados");
                window.location.reload();
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
              }
            );
        }
        if (result === 0) {
          this.dialog.closeAll();
        }
      });
  }
}
