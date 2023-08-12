import { Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { AlertDialogComponent } from "../alert-dialog/alert-dialog.componetn";
import * as moment from "moment";
import { EntornoService } from "../../../entorno/entorno.service";

import { AfiliadosService } from "../../../portal/afiliados/afiliados.service";

@Component({
  selector: "dcard-perdida-dialog",
  templateUrl: "dcard-perdida-dialog.component.html",
  providers: [AfiliadosService],
})
export class DcardPerdidaDialogComponent {
  public title: string;
  public yesOption: string;
  public width: string;
  public height: string;
  public cuentas: any[];
  public tipoPersona: string;

  public dcard: any[];
  public staPan: any;
  public afiliado: any[];

  public gestiones: any[];

  public loading: boolean = true;

  public fecha: string;
  public monto: string;

  public disabledButtonA: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DcardPerdidaDialogComponent>,
    private service: AfiliadosService,
    public dialog: MatDialog,
    private entorno: EntornoService
  ) {
    dialogRef.disableClose = true;
    this.title = data.title;
    this.yesOption = data.mensajeBoton;
    this.cuentas = data.cuentas;
    this.tipoPersona = data.tipoPersona;

    this.dcard = data.dcard;
    this.staPan = data.staPan;
    this.afiliado = data.afiliado;

    this.fecha = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");

    this.monto = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
    }).format(parseFloat(this.dcard["saldo_disponible"]));

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

  perdida() {
    this.disabledButtonA = true;
    const nota: any = (<HTMLInputElement>document.getElementById("nota")).value;
    let option = 0;

    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: "PERDIDA",
          message: "No podrá deshacer esta opción",
          yes: "Aceptar",
          no: "Cancelar",
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 1) {
          const proceso1: any = document.getElementById("proceso1");
          const proceso2: any = document.getElementById("proceso2");
          if (proceso1.checked) {
            console.log("Si");
            option = 1;
          } else if (proceso2.checked) {
            console.log("No");
            option = 0;
          }

          this.service
            .perdidaDcard(
              this.dcard["id"],
              this.entorno.auth()["user"].id,
              nota,
              option
            )
            .subscribe(
              (res: any) => {
                console.log(res);
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
