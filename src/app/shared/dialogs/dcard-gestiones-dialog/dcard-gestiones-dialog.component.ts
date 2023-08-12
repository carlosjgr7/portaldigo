import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogService } from "../dialog.service";
import { AlertDialogComponent } from "../../../shared/dialogs/alert-dialog/alert-dialog.componetn";
import * as moment from "moment";
import { EntornoService } from "../../../entorno/entorno.service";

import { AfiliadosService } from "../../../portal/afiliados/afiliados.service";

@Component({
  selector: "dcard-gestiones-dialog",
  templateUrl: "dcard-gestiones-dialog.component.html",
  providers: [AfiliadosService],
})
export class DcardGestionesDialogComponent {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DcardGestionesDialogComponent>,
    private service: AfiliadosService,
    public dialog: MatDialog,
    private entorno: EntornoService,
    private router: Router
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
    console.log(new Date());

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

    const date = new Date();
    console.log(date.getHours(), date.getMinutes());

    const hora = date.getHours() + "-" + date.getMinutes();

    if (hora > "15-10" && hora < "15-20") {
      this.disabledButtonA = true;
    }
  }

  onClick(option: number) {
    this.dialogRef.close(option);
  }

  onGestiones() {}

  noAprobar() {
    this.disabledButtonA = true;
    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: "ALERTA",
          message: "No podrá deshacer esta opción",
          yes: "Aceptar",
          no: "Cancelar",
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 1) {
          const nota: any = (<HTMLInputElement>document.getElementById("nota"))
            .value;

          this.service
            .noAprobarDcard(
              this.dcard["id"],
              this.entorno.auth()["user"].id,
              nota
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

  aprobar() {
    this.disabledButtonA = true;
    const nota: any = (<HTMLInputElement>document.getElementById("nota")).value;
    let option = 0;

    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: "APROBAR",
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
            .aprobarDcard(
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
