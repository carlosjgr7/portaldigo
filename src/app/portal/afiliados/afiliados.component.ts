import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { Route } from "@angular/router";

import { Observable } from "rxjs/Observable";
import { EntornoService } from "../../entorno/entorno.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { AfiliadosService } from "./afiliados.service";

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";

import { ExcelService } from "../../excel/excel.service";

var element_data: any = [];

@Component({
  selector: "app-afiliados",
  templateUrl: "./afiliados.component.html",
  styleUrls: ["./afiliados.component.scss"],
  providers: [
    AfiliadosService,
    ExcelService,
    { provide: MAT_DATE_LOCALE, useValue: "ja-JP" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: [
    trigger("alertAnimable", [
      state(
        "show",
        style({
          opacity: 1,
        })
      ),
      state(
        "hidden",
        style({
          opacity: 0,
        })
      ),
      transition("hidden => show", animate(1000)),
      transition("show => hidden", animate(4000)),
    ]),
  ],
})
export class AfiliadosComponent implements OnInit {
  constructor(
    private ref: ChangeDetectorRef,
    private entornoService: EntornoService,
    private router: Router,
    private service: AfiliadosService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private adapter: DateAdapter<any>
  ) {}

  public filtro: string;

  public tipo: string;

  public n_naturales: number;

  public afiliados_naturales: any;

  public afiliados_naturales_export: any;

  public ultimo_natural: string;

  public n_juridicos: number;

  public afiliados_juridicos: any;

  public afiliados_juridicos_export: any;

  public ultimo_juridico: string;

  public global_alert = this.entornoService.pivot_msg;

  public state = "show";

  public loading = true;

  onSequenceChangeEvent() {
    if (this.filtro != null) {
      this.filtro = this.entornoService.limpiarCampo(
        this.filtro.toString(),
        "filtro"
      );
    }
  }

  excel(tipo: number) {
    this.loading = true;

    var obj: any = [];

    var objCtas: any = [];

    if (tipo == 1) {
      this.service.getAfiliados("B", this.filtro, null, true).subscribe(
        (response) => {
          this.afiliados_naturales_export = response;

          for (let i = 0; i < this.afiliados_naturales_export.length; i++) {
            //
            obj.push({
              id: this.afiliados_naturales_export[i].id,
              Codigo: this.afiliados_naturales_export[i].idCliente,
              Correo: this.afiliados_naturales_export[i].correo,
              "Creado en fecha": this.afiliados_naturales_export[i].creado,
              Estatus: this.afiliados_naturales_export[i].estatus,
              "Ultimo cambio de clave":
                this.afiliados_naturales_export[i].fechaContrasena,
              Identificacion: this.afiliados_naturales_export[i].identificacion,
              "Ultima modificacion":
                this.afiliados_naturales_export[i].modificado,
              "Nombre completo":
                this.afiliados_naturales_export[i].nombreCompleto,
              "Numero de cuenta":
                this.afiliados_naturales_export[i].numeroCuenta,
              "Numero de telefono":
                this.afiliados_naturales_export[i].numeroTelefono,
              "Tipo de cuenta": this.afiliados_naturales_export[i].tipoCuenta,
              "Tipo persona": this.afiliados_naturales_export[i].tipoPersona,
              "Tipo usuario": this.afiliados_naturales_export[i].tipoUsuario,
              Usuario: this.afiliados_naturales_export[i].usuario,
            });

            if (this.afiliados_naturales_export[i].cuentas.length > 0) {
              var cuentasAfiliado = this.afiliados_naturales_export[i].cuentas;

              for (let j = 0; j < cuentasAfiliado.length; j++) {
                objCtas.push({
                  Identificacion:
                    this.afiliados_naturales_export[i].identificacion,
                  "Numero Cuenta": cuentasAfiliado[j].cuentaBanco,
                  "Tipo Cuenta": cuentasAfiliado[j].tipoCuenta,
                  Banco: cuentasAfiliado[j].nombreBanco,
                });
              }
            }
          }

          setTimeout(() => {
            this.loading = false;
            this.excelService.exportAsExcelFile(
              obj,
              objCtas,
              "afiliados-naturales"
            );
          }, 3000);
        },
        (error) => {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje =
            "Ha ocurrido un error: " + error.error.error;
          this.entornoService.hideAlert();
          this.loading = false;
        }
      );
    } else {
      this.service.getAfiliados("A", this.filtro, null, true).subscribe(
        (response) => {
          this.afiliados_juridicos_export = response;

          for (let i = 0; i < this.afiliados_juridicos_export.length; i++) {
            obj.push({
              id: this.afiliados_juridicos_export[i].id,
              Codigo: this.afiliados_juridicos_export[i].idCliente,
              Correo: this.afiliados_juridicos_export[i].correo,
              "Creado en fecha": this.afiliados_juridicos_export[i].creado,
              Estatus: this.afiliados_juridicos_export[i].estatus,
              "Ultimo cambio de clave":
                this.afiliados_juridicos_export[i].fechaContrasena,
              Identificacion: this.afiliados_juridicos_export[i].identificacion,
              "Ultima modificacion":
                this.afiliados_juridicos_export[i].modificado,
              "Nombre completo":
                this.afiliados_juridicos_export[i].nombreCompleto,
              "Numero de cuenta":
                this.afiliados_juridicos_export[i].numeroCuenta,
              "Numero de telefono":
                this.afiliados_juridicos_export[i].numeroTelefono,
              "Tipo de cuenta": this.afiliados_juridicos_export[i].tipoCuenta,
              "Tipo persona": this.afiliados_juridicos_export[i].tipoPersona,
              "Tipo usuario": this.afiliados_juridicos_export[i].tipoUsuario,
              Usuario: this.afiliados_juridicos_export[i].usuario,
            });

            if (this.afiliados_juridicos_export[i].cuentas.length > 0) {
              var cuentasAfiliado = this.afiliados_juridicos_export[i].cuentas;

              for (let j = 0; j < cuentasAfiliado.length; j++) {
                objCtas.push({
                  Identificacion:
                    this.afiliados_juridicos_export[i].identificacion,
                  "Numero Cuenta": cuentasAfiliado[j].cuentaBanco,
                  "Tipo Cuenta": cuentasAfiliado[j].tipoCuenta,
                  Banco: cuentasAfiliado[j].nombreBanco,
                });
              }
            }
          }

          setTimeout(() => {
            this.loading = false;
            this.excelService.exportAsExcelFile(
              obj,
              objCtas,
              "afiliados-juridicos"
            );
          }, 3000);
        },
        (error) => {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje =
            "Ha ocurrido un error: " + error.error.error;
          this.entornoService.hideAlert();
          this.loading = false;
        }
      );
    }
  }

  manageExcelFile(response: any, fileName: string, tipo_persona: string): void {
    const downloadLink = document.createElement("a");
    downloadLink.href = "http://localhost:3000/v2/reporte/" + tipo_persona;
    downloadLink.setAttribute("download", fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  reporte(tipo_persona) {
    this.loading = true;
    this.service.getReporte(tipo_persona).subscribe(
      (response) => {
        this.manageExcelFile(response, "Reportes", tipo_persona);
        this.loading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }

        this.loading = false;
      }
    );
  }

  refresh() {
    this.loading = true;

    this.service.getAfiliados("B").subscribe(
      (response) => {
        this.afiliados_naturales = response;

        this.n_naturales = this.afiliados_naturales.length;

        if (this.n_naturales > 0 && this.n_naturales != 1) {
          ///this.global_alert.act = false;

          let temp = this.afiliados_naturales.pop();

          this.ultimo_natural = temp.usuario;

          this.afiliados_naturales.push(temp);
        } else if (this.n_naturales == 1) {
          //this.global_alert.act = false;
          this.ultimo_natural = this.afiliados_naturales[0].usuario;
        } else {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje =
            "No existen afiliados naturales en la base de datos.";
          this.entornoService.hideAlert();
        }

        this.loading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }

        this.loading = false;
      }
    );

    this.service.getAfiliados("A").subscribe(
      (response) => {
        this.afiliados_juridicos = response;

        this.n_juridicos = this.afiliados_juridicos.length;

        if (this.n_juridicos > 0 && this.n_juridicos != 1) {
          //this.global_alert.act = false;
          let temp = this.afiliados_juridicos.pop();

          this.ultimo_juridico = temp.usuario;

          this.afiliados_juridicos.push(temp);
        } else if (this.n_juridicos == 1) {
          ///this.global_alert.act = false;
          this.ultimo_juridico = this.afiliados_juridicos[0].usuario;
        } else {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje =
            "No existen afiliados juridicos en la base de datos.";
          this.entornoService.hideAlert();
        }
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }
      }
    );
  }

  ngOnInit() {
    this.adapter.setLocale("es");

    this.loading = true;

    this.service.getAfiliados("B").subscribe(
      (response) => {
        this.afiliados_naturales = response;

        this.n_naturales = this.afiliados_naturales.length;

        if (this.n_naturales > 0 && this.n_naturales != 1) {
          ///this.global_alert.act = false;

          let temp = this.afiliados_naturales.pop();

          this.ultimo_natural = temp.usuario;

          this.afiliados_naturales.push(temp);
        } else if (this.n_naturales == 1) {
          //this.global_alert.act = false;
          this.ultimo_natural = this.afiliados_naturales[0].usuario;
        } else {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje =
            "No existen afiliados naturales en la base de datos.";
          this.entornoService.hideAlert();
        }

        this.loading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }
      }
    );

    this.service.getAfiliados("A").subscribe(
      (response) => {
        this.afiliados_juridicos = response;

        //console.log(this.afiliados_juridicos )

        this.n_juridicos = this.afiliados_juridicos.length;

        if (this.n_juridicos > 0 && this.n_juridicos != 1) {
          //this.global_alert.act = false;

          let temp = this.afiliados_juridicos.pop();

          this.ultimo_juridico = temp.usuario;

          this.afiliados_juridicos.push(temp);
        } else if (this.n_juridicos == 1) {
          ///this.global_alert.act = false;
          this.ultimo_juridico = this.afiliados_juridicos[0].usuario;
        } else {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje =
            "No existen afiliados juridicos en la base de datos.";
          this.entornoService.hideAlert();
        }
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }
      }
    );
  }

  buscar(tipo: string, filtro: string): void {
    let filter = filtro;

    if (filter != null) {
      filter = this.entornoService.limpiarCampo(filter.toString(), "filtro");
    }

    this.ultimo_juridico = null;
    this.ultimo_natural = null;

    this.loading = true;

    this.service.getAfiliados(tipo, this.filtro, null).subscribe(
      (response) => {
        if (tipo == "B") {
          this.afiliados_naturales = response;

          this.n_naturales = this.afiliados_naturales.length;

          if (this.n_naturales > 0 && this.n_naturales != 1) {
            this.global_alert.act = false;

            let temp = this.afiliados_naturales.pop();

            this.ultimo_natural = temp.usuario;

            this.afiliados_naturales.push(temp);
          } else if (this.n_naturales == 1) {
            this.global_alert.act = false;
            this.ultimo_natural = this.afiliados_naturales[0].usuario;
          } else {
            this.global_alert.act = true;
            this.global_alert.type = "alert-danger";
            this.global_alert.mensaje =
              "No existen afiliados naturales asociados a su criterio de busqueda.";
            this.entornoService.hideAlert();
          }
        } else {
          this.afiliados_juridicos = response;

          this.n_juridicos = this.afiliados_juridicos.length;

          if (this.n_juridicos > 0 && this.n_juridicos != 1) {
            let temp = this.afiliados_juridicos.pop();

            this.ultimo_juridico = temp.usuario;

            this.afiliados_juridicos.push(temp);
          } else if (this.n_juridicos == 1) {
            this.ultimo_juridico = this.afiliados_juridicos[0].usuario;
          } else {
            this.global_alert.act = true;
            this.global_alert.type = "alert-danger";
            this.global_alert.mensaje =
              "No existen afiliados juridicos asociados a su criterio de busqueda.";

            this.entornoService.hideAlert();
          }
        }

        this.loading = false;
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }

        this.loading = false;
      }
    );
  }

  verMas(tipo: string, ultimo: string): void {
    this.loading = true;

    this.service.getAfiliados(tipo, this.filtro, ultimo).subscribe(
      (response) => {
        let res: any = response;

        if (tipo == "B") {
          for (var i = 0; i < res.length; i++) {
            this.afiliados_naturales.push(res[i]);
          }

          this.n_naturales = res.length;

          if (this.n_naturales == 0) {
            this.entornoService.pivot_msg.act = true;

            this.entornoService.pivot_msg.type = "alert-danger";

            this.entornoService.pivot_msg.act =
              "No existen afiliados naturales asociados a su criterio de busqueda.";
            this.entornoService.hideAlert();
          } else {
            let temp = this.afiliados_naturales.pop();

            this.ultimo_natural = null;

            this.ultimo_natural = temp.usuario;

            this.afiliados_naturales.push(temp);
          }

          this.loading = false;
        } else {
          for (var i = 0; i < res.length; i++) {
            this.afiliados_juridicos.push(res[i]);
          }

          this.n_juridicos = res.length;

          if (this.n_juridicos == 0) {
            this.entornoService.pivot_msg.act = true;

            this.entornoService.pivot_msg.type = "alert-danger";

            this.entornoService.pivot_msg.act =
              "No existen afiliados juridicos asociados a su criterio de busqueda.";
            this.entornoService.hideAlert();
          } else {
            let temp = this.afiliados_juridicos.pop();

            this.ultimo_juridico = null;

            this.ultimo_juridico = temp.usuario;

            this.afiliados_juridicos.push(temp);
          }
        }
      },
      (error) => {
        if (error.status == 401) {
          this.entornoService.clearSession();

          this.entornoService.caduco_sesion =
            "Su sesion ha expirado, ingrese nuevamente.";

          this.router.navigate(["/"]);
        }
      }
    );
  }

  openDialog(id: number, usuario: string): void {
    let dialogRef = this.dialog.open(DeleteAfiliadosComponent, {
      width: "450px",
      data: { id: id, usuario: usuario },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.refresh();
      //this.refreshBancos();
    });
  }
}

@Component({
  selector: "delete-afiliados",
  templateUrl: "./delete-afiliados.component.html",
  providers: [AfiliadosService],
})
export class DeleteAfiliadosComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteAfiliadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entornoService: EntornoService,
    private router: Router,
    private service: AfiliadosService
  ) {}

  public mensaje_delete: string;

  public borrado: boolean = false;
  public loading: boolean = false;
  onNoClick(): void {
    this.dialogRef.close();
    var slf = this;
  }

  borrar(id: number): void {
    this.loading = true;
    this.service.borrar(id).subscribe(
      (response) => {
        this.loading = false;

        this.borrado = true;

        this.mensaje_delete = "Desafiliación realizada exitosamente";
      },
      (error) => {
        this.loading = false;

        this.borrado = true;

        this.mensaje_delete = error.error.mensaje;
      }
    );
  }
}
