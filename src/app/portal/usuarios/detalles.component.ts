import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { NgModule } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Route } from "@angular/router";

import { Observable } from "rxjs/Observable";
import { EntornoService } from "../../entorno/entorno.service";

import { UsuariosService } from "./usuarios.service";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

var element_data: any = [];

@Component({
  selector: "app-usuarios-detalles",
  templateUrl: "./detalles.component.html",
  styleUrls: ["./usuarios.component.scss"],
  providers: [UsuariosService],
})
export class DetallesUsuarioComponent implements OnInit {
  public loading: boolean = true;
  constructor(
    private ref: ChangeDetectorRef,
    private entornoService: EntornoService,
    private router: Router,
    private service: UsuariosService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.loading = true;
  }

  public global_alert = this.entornoService.pivot_msg;

  public usuario: any;
  private id: any = this.route.snapshot.params["id"];

  public passwdReestablecida: boolean = false;

  ngOnInit() {
    this.loading = true;
    this.entornoService.hideAlert();

    this.service.getUsuario(this.id).subscribe(
      (response) => {
        this.usuario = response;

        if (this.usuario) {
          this.loading = false;
        }
      },
      (error) => {}
    );
    this.loading = false;
  }

  openDialog(id: number) {
    let dialogRef = this.dialog.open(ReestablecerPasswordAdminComponent, {
      width: "450px",
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      //this.passwdReestablecida = true;
      this.router.navigate(["/portal/usuarios"]);
    });
  }

  restablecerPasswd(id: number) {
    this.service.reestablecerPasswordAdmin(id).subscribe(
      (response) => {
        this.global_alert.act = true;
        this.global_alert.type = "alert-success";
        this.global_alert.mensaje = "Contraseña reestablecida con exito.";

        this.entornoService.hideAlert();

        this.passwdReestablecida = true;
      },
      (error) => {
        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Ha ocurrido un error.";

        this.entornoService.hideAlert();
        this.passwdReestablecida = false;
      }
    );
  }

  refreshUsuarios(): void {}
}

@Component({
  selector: "reestablecer-password",
  templateUrl: "./reestablecer-password.component.html",
  providers: [UsuariosService],
})
export class ReestablecerPasswordAdminComponent {
  constructor(
    public dialogRef: MatDialogRef<ReestablecerPasswordAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entornoService: EntornoService,
    private service: UsuariosService
  ) {}

  public mensaje_update: string;

  public actualizado: boolean = false;
  public loading: boolean = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  restablecerPasswd(id: number) {
    this.loading = true;
    this.service.reestablecerPasswordAdmin(id).subscribe(
      (response) => {
        this.loading = false;
        this.actualizado = true;

        this.mensaje_update = "Contraseña reestablecida con exito.";
      },
      (error) => {
        this.loading = false;

        this.actualizado = true;
      }
    );
  }
}
