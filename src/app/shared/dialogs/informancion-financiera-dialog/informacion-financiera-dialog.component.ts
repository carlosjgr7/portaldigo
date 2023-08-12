import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "informacion-financiera-dialog",
  templateUrl: "informacion-financiera-dialog.component.html",
})
export class InformacionFinancieraDialogComponent {
  public title: string;
  public yesOption: string;
  public width: string;
  public height: string;
  public cuentas: any[];
  public tipoPersona: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InformacionFinancieraDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.title = data.title;
    this.yesOption = data.mensajeBoton;
    this.cuentas = data.cuentas;
    this.tipoPersona = data.tipoPersona;
  }

  onClick(option: number) {
    this.dialogRef.close(option);
  }
}
