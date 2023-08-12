import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogService } from "../dialog.service";

import { DcardGestionesDialogComponent } from "../dcard-gestiones-dialog/dcard-gestiones-dialog.component";
import { DcardDistribucionDialogComponent } from "../dcard-distribucion-dialog/dcard-distribucion-dialog.component";
import { DcardActivacionDialogComponent } from "../dcard-activacion-dialog/dcard-activacion-dialog.component";
import { DcardBloqueoDialogComponent } from "../dcard-bloqueo-dialog/dcard-bloqueo-dialog.component";
import { DcardPerdidaDialogComponent } from "../dcard-perdida-dialog/dcard-perdida-dialo.component";
import { DcardRoboDialogComponent } from "../dcard-robo-dialog/dcard-robo-dialog.component";
import { DcardDeterioroDialogComponent } from "../dcard-deterioro-dialog/dcard-deterioro-dialog.component";
import { DcardGeneralDialogComponent } from "../dcard-general-dialog/dcard-general-dialog.component";
import { DcardVerGeneralDialogComponent } from "../dcard-vergeneral-dialog/dcard-vergeneral-dialog.component";
import { AlertDialogComponent } from "../alert-dialog/alert-dialog.componetn";

import { AfiliadosService } from "../../../portal/afiliados/afiliados.service";

@Component({
  selector: "dcard-dialog",
  templateUrl: "dcard-dialog.component.html",
  providers: [AfiliadosService],
})
export class DcardDialogComponent {
  public title: string;
  public yesOption: string;
  public width: string;
  public height: string;
  public cuentas: any[];
  public tipoPersona: string;

  public dcard: any[];
  public staPan: any;
  public afiliado: any[];
  public pan_dcard: any;

  public gestiones: any[];

  public loading: boolean = true;

  public fec_emi: any;

  public gestionesGral: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DcardDialogComponent>,
    private service: AfiliadosService,
    public dialog: MatDialog
  ) {
    dialogRef.disableClose = true;
    this.title = data.title;
    this.yesOption = data.mensajeBoton;
    this.cuentas = data.cuentas;
    this.tipoPersona = data.tipoPersona;

    this.dcard = data.dcard;
    this.staPan = data.staPan;
    this.afiliado = data.afiliado;

    if (this.dcard["pan"] === null) {
      this.pan_dcard = "No tiene DCARD registrada";
      this.fec_emi = "N/A";
    } else {
      this.pan_dcard =
        this.dcard["pan"].substring(0, 4) +
        "-" +
        this.dcard["pan"].substring(4, 6) +
        "**-****-" +
        this.dcard["pan"].substring(12, 16);

      //this.fec_emi = this.dcard["fecemi"] | date: "dd-MM-yyyy";
    }

    this.service.getGestion(this.afiliado["id"]).subscribe(
      (res: any) => {
        this.loading = false;
        this.gestiones = res;
        //console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );

    this.service.getGestionGral(this.afiliado["id"]).subscribe(
      (res: any) => {
        this.loading = false;
        this.gestionesGral = res;
        //console.log(res[0]);
        if (res[0] === undefined) {
          this.gestionesGral = "nada";
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onClick(option: number) {
    this.dialogRef.close(option);
  }

  onGestiones() {
    this.dialog
      .open(DcardGestionesDialogComponent, {
        width: "600px",
        data: {
          title: "Gestiones",
          dcard: this.dcard,
          staPan: this.staPan,
          afiliado: this.afiliado,
          mensajeBoton: "Cancelar",
        },
      })
      .afterClosed()
      .subscribe((result) => {});
  }

  onDistribucion() {
    this.dialog
      .open(DcardDistribucionDialogComponent, {
        width: "600px",
        data: {
          title: "Distribucion",
          dcard: this.dcard,
          staPan: this.staPan,
          afiliado: this.afiliado,
          mensajeBoton: "Cancelar",
        },
      })
      .afterClosed()
      .subscribe((result) => {});
  }

  onActivacion() {
    //this.dcard["staPan"] !== 5 &&
    if (this.dcard && this.dcard["pan"] !== null) {
      this.dialog
        .open(DcardActivacionDialogComponent, {
          width: "600px",
          data: {
            title: "Activación",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No puede Activar la DCARD aún",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onBloqueo() {
    if (this.dcard && this.dcard["staPan"] === 6) {
      this.dialog
        .open(DcardBloqueoDialogComponent, {
          width: "600px",
          data: {
            title: "Bloqueo",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No puede Bloquear la DCARD",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onPerdida() {
    //this.dcard["staPan"] !== 5 &&
    if (this.dcard && this.dcard["pan"] !== null) {
      this.dialog
        .open(DcardPerdidaDialogComponent, {
          width: "600px",
          data: {
            title: "Pérdida",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No puede colocar la DCARD en Pérdida",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onDeterioro() {
    //this.dcard["staPan"] !== 5 &&
    if (this.dcard && this.dcard["pan"] !== null) {
      this.dialog
        .open(DcardDeterioroDialogComponent, {
          width: "600px",
          data: {
            title: "Deterioro",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No puede colocar la DCARD en Deterioro",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onRobo() {
    //this.dcard["staPan"] !== 5 &&
    if (this.dcard && this.dcard["pan"] !== null) {
      this.dialog
        .open(DcardRoboDialogComponent, {
          width: "600px",
          data: {
            title: "Robo",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No puede colocar la DCARD en Robo",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onGeneral() {
    //this.dcard["staPan"] !== 5 &&
    if (this.dcard) {
      this.dialog
        .open(DcardGeneralDialogComponent, {
          width: "600px",
          data: {
            title: "General",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "Negado",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onVerGeneral() {
    if (this.dcard) {
      this.dialog
        .open(DcardVerGeneralDialogComponent, {
          width: "800px",
          data: {
            title: "General",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Volver",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No hay Gestiones General",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }

  onDesbloqueo() {
    if (this.dcard && this.dcard["staPan"] === 7) {
      this.dialog
        .open(DcardBloqueoDialogComponent, {
          width: "600px",
          data: {
            title: "Desbloqueo",
            dcard: this.dcard,
            staPan: this.staPan,
            afiliado: this.afiliado,
            mensajeBoton: "Cancelar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ALERTA",
            message: "No puede Desbloquear la DCARD",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    }
  }
}
