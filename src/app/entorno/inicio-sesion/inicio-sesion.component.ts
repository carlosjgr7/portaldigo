import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { EntornoService } from "../entorno.service";

import { UsuariosService } from "../../portal/usuarios/usuarios.service";
import * as moment from "moment";

@Component({
  selector: "app-inicio-sesion",
  templateUrl: "./inicio-sesion.component.html",
  styleUrls: ["./inicio-sesion.component.scss"],
  providers: [UsuariosService],
})
export class InicioSesionComponent implements OnInit {
  public form: FormGroup;

  public mensaje: string;

  public alert_caduco_sesion: string;

  public pass_caduco: boolean = false;

  public hide: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private entornoService: EntornoService,
    public dialog: MatDialog,
    public usuarioService: UsuariosService
  ) {
    var logged: any = this.entornoService.auth();

    if (logged.auth) {
      this.router.navigate(["portal"]);
    }
  }

  ngOnInit() {
    this.alert_caduco_sesion = this.entornoService.caduco_sesion;

    this.form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  onIniciarSesion() {
    //this.mensaje = "Su contrasena ha caducado. Presione cambiar.";

    //this.pass_caduco = true;
    if (this.form.controls["password"].value != null) {
      this.form.controls["password"].setValue(
        this.entornoService.limpiarCampo(
          this.form.controls["password"].value.toString(),
          "contrasena"
        )
      );
    }
    if (this.form.controls["username"].value != null) {
      this.form.controls["username"].setValue(
        this.entornoService.limpiarCampo(
          this.form.controls["username"].value.toString(),
          "texto"
        )
      );
    }
    this.entornoService
      .iniciarSesion(
        this.form.controls["username"].value,
        this.form.controls["password"].value
      )
      .subscribe(
        (response) => {
          let token = response.headers.get("X-Auth-Token");

          //let rol:any = response.body['rol'];

          this.entornoService.inicializar(token);
          const format1 = "YYYY-MM-DD HH:mm:ss.SSS";
          this.entornoService.fechaInicio = moment(new Date()).format(format1);
          this.entornoService.setSession(
            token,
            this.form.controls["username"].value.toString().toLowerCase(),
            response.body["nombreCompleto"],
            response.body["ultima_conexion"],
            response.body["rol"].nombre,
            response.body["id"]
          );

          this.entornoService.caduco_sesion = null;
          this.alert_caduco_sesion = null;
          this.hide = false;
          this.router.navigate(["/portal"]);
        },
        (error) => {
          console.log(error);

          if (error.error.codigo == 153) {
            this.pass_caduco = true;
          }

          if (error.error.mensaje) {
            this.mensaje = error.error.mensaje;
          } else {
            this.mensaje = "No se pudo iniciar sesión";
          }
        }
      );
  }

  openDialog(usuario: string): void {
    let dialogRef = this.dialog.open(RestablecerPassComponent, {
      width: "450px",
      data: { usuario: usuario, clave: this.form.controls["password"].value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(["/portal"]);
    });
  }
}

@Component({
  selector: "reestablecer-password",
  templateUrl: "./reestablecer-password.component.html",
  providers: [EntornoService, UsuariosService],
})
export class RestablecerPassComponent {
  constructor(
    public dialogRef: MatDialogRef<RestablecerPassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entornoService: EntornoService,
    private router: Router,
    private usuarioService: UsuariosService
  ) {}

  public mensaje: string;

  public reestablecido: boolean = false;

  public contrasenaActual: string = null;
  public contrasena: string = null;
  public contrasena1: string = null;

  onNoClick(): void {
    this.dialogRef.close();
  }

  reestablecer(usuario, contrasena, contrasena1, clave) {
    if (contrasena != contrasena1) {
      this.mensaje = "Las contrasenas no coinciden.";
    } else if (contrasena == "" || contrasena == null) {
      this.mensaje = "Escriba una contrasena";
    } else if (contrasena1 == "" || contrasena1 == null) {
      this.mensaje = "Confirme su contrasena";
    } else {
      ///c

      let user = {
        usuario: usuario,
        clave: clave,
        clave1: contrasena1,
      };

      this.usuarioService.reestablecerPassword(user).subscribe(
        (response) => {
          this.reestablecido = true;
        },
        (error) => {
          this.mensaje = error.error.mensaje;
        }
      );
    }
  }
}
