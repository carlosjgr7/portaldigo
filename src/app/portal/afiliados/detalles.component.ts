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
import { DcardDialogComponent } from "../../shared/dialogs/dcard-dialog/dcard-dialog.component";
import { ListaRecaudosDialogComponent } from "../../shared/dialogs/lista-recaudos-dialog/lista-recaudos-dialog.component";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { ConfirmationDialogComponent } from "../../shared/dialogs/confirmation-dialog/confirmation-dialog.component";
import { ThrowStmt } from "@angular/compiler";

var element_data: any = [];

@Component({
  selector: "app-detalle",
  templateUrl: "./detalles-v2.component.html",
  styleUrls: ["./afiliados.component.scss"],
  providers: [AfiliadosService],
})
export class DetallesAfiliadoComponent implements OnInit {
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
  public servicioTransporteActivo: boolean;
  public servicioTransporteDesactivado: boolean;
  public carnetCreado: boolean;
  public parametrosPasajero: any;
  public validando: boolean;
  public poseeCarnet: boolean;
  public qrPrevio: string;

  public aci: any;
  public selected_aci;
  public aci_user: any;

  public dcard: any;
  public panE: any = "";
  public staPan: any = "";

  public actPagoM: boolean = false;

  ngOnInit() {
    this.service.getAcis().subscribe(
      (res: any) => {
        this.aci = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this.loading = true;
    this.service.getAfiliado(this.id).subscribe(
      (response) => {
        this.loading = false;
        this.afiliado = response;

        this.validarPermisos();
        this.buscarParametrosCarnet();
        if (this.afiliado.tipoPersona == "A") {
          if (
            this.afiliado.modificado != null ||
            this.afiliado.modificado != undefined ||
            this.afiliado.modificado != ""
          ) {
            this.noModificado = true;
          } else {
            this.noModificado = false;
          }
          this.consultaActividades();
          this.consultaCuentas();
        }
        if (this.afiliado.recaudos.length > 0) {
          this.listarTipoRecaudos();
          for (let index = 0; index < this.afiliado.recaudos.length; index++) {
            this.afiliado.recaudos[index].cambiado = false;
            //this.afiliado.recaudos[index].tipoDocumento = this.nombreRecaudo(this.afiliado.recaudos[index].idRecaudo);
          }
          this.recaudos = this.afiliado.recaudos;
        }
        if (this.afiliado.tipoPersona == "B") {
          switch (this.afiliado.sexo) {
            case 1:
              this.afiliado.sexoValor = "Femenino";
              break;
            case 2:
              this.afiliado.sexoValor = "Masculino";
              break;
            case 3:
              this.afiliado.sexoValor = "Otros";
              break;
          }
          switch (this.afiliado.edo_civil) {
            case 4:
              this.afiliado.edoCivilValor = "Soltero/a";
              break;
            case 5:
              this.afiliado.edoCivilValor = "Casado/a";
              break;
            case 6:
              this.afiliado.edoCivilValor = "Viudo/a";
              break;
            case 7:
              this.afiliado.edoCivilValor = "Divorciado/a";
              break;
          }
        }
        if (this.afiliado.monto_mov != null) {
          this.afiliado.monto_mov = this.entornoService.pipeDecimalBigNumber(
            this.afiliado.monto_mov.toString()
          );
        }

        this.chequearDireccion();
        //console.log(this.afiliado);

        this.service.getIdAcid(this.afiliado.id).subscribe(
          (res: any) => {
            this.selected_aci = res.id_aci;
            this.aci_user = this.aci[res.id_aci - 1];
            //console.log(this.aci_user);
          },
          (err) => {
            console.log(err);
          }
        );

        this.service.getDcard(this.afiliado.identificacion).subscribe(
          (res: any) => {
            if (res !== undefined) {
              this.dcard = res;

              if (res.pan === null) {
                this.panE = "No tiene DCARD registrada";
              } else {
                const pan = res.pan;
                this.panE =
                  pan.substring(0, 4) +
                  "-" +
                  pan.substring(4, 6) +
                  "**-****-" +
                  pan.substring(12, 16);
              }

              if (res.staPan === 1) {
                this.staPan = "Solicitud";
              }
              if (res.staPan === 2) {
                this.staPan = "Aprobación";
              }
              if (res.staPan === 3) {
                this.staPan = "Emboce";
              }
              if (res.staPan === 4) {
                this.staPan = "Recep Banco";
              }
              if (res.staPan === 5) {
                this.staPan = "Distribución";
              }
              if (res.staPan === 6) {
                this.staPan = "Activación";
              }
              if (res.staPan === 7) {
                this.staPan = "Bloqueo";
              }
              if (res.staPan === 8) {
                this.staPan = "No Aprobada";
              }
              if (res.staPan === 9) {
                this.staPan = "Pérdida";
              }
              if (res.staPan === 10) {
                this.staPan = "Deterioro";
              }
              if (res.staPan === 11) {
                this.staPan = "Robo";
              }
              if (res.staPan === 12) {
                this.staPan = "Vencimiento";
              }
              if (res.staPan === 13) {
                this.staPan = "General";
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (error) => {}
    );
  }

  consultaActividades() {
    this.service.getActividades().subscribe((response) => {
      this.actividades = response;
      this.categorias = this.actividades.filter((a) => a.id_padre == 0);
      this.subCategorias = this.actividades.filter((a) => a.visible == true);
      if (this.afiliado && this.afiliado.id_act_ec) {
        let subCat = this.subCategorias.find(
          (a) => a.id == this.afiliado.id_act_ec
        );

        if (subCat != undefined && subCat != null && subCat != "") {
          this.subCategorias = this.subCategorias.filter(
            (s) => s.id_padre == subCat.id_padre
          );
          this.afiliado.actividad = subCat.descripcion;
          this.afiliado.categoria = this.categorias.find(
            (c) => c.id == subCat.id_padre
          ).descripcion;
          this.esUnico = false;
        } else {
          this.afiliado.activida = undefined;
          this.esUnico = true;
          this.afiliado.categoria = this.categorias.find(
            (c) => c.id == this.afiliado.id_act_ec
          ).descripcion;
        }
      }
    });
  }

  consultaCuentas() {
    this.service
      .getCuentaAfiliado(this.afiliado.usuario)
      .subscribe((response) => {
        this.cuentas = response;
        this.cuentas.forEach((cuenta) => {
          if (cuenta.porcLiqAuto.toString().includes(".")) {
            cuenta.porcLiqAuto = cuenta.porcLiqAuto
              .toString()
              .replace(".", ",");
          }
        });
      });
  }

  liqAutoChange() {}

  onPorcChange() {}

  listarTipoRecaudos() {
    let tipoPersona: string;
    if (this.afiliado.tipoPersona == "A") {
      tipoPersona = "Empresas";
    } else {
      tipoPersona = "Personas";
    }
    this.service.listarTipoRecaudos(tipoPersona).subscribe((response) => {
      let tiposRecaudos: any = response;
      for (let i = 0; i < this.afiliado.recaudos.length; i++) {
        for (let index = 0; index < tiposRecaudos.length; index++) {
          if (this.afiliado.recaudos[i].idRecaudo == tiposRecaudos[index].id) {
            this.afiliado.recaudos[i].tipoDocumento =
              tiposRecaudos[index].nombreCorto;
          }
        }
      }
    });
  }

  revisarPorcentajes(): boolean {
    let suma = 0;
    let falla = false;
    this.cuentas.forEach((cuenta) => {
      if (cuenta.porcLiqAuto) {
        let porcentaje = cuenta.porcLiqAuto;
        if (typeof porcentaje == "string" && porcentaje.includes(",")) {
          porcentaje = porcentaje.replace(",", ".");
        }
        suma = suma + Number(porcentaje);
      } else {
        falla = true;
      }
    });

    return !falla && suma == 100;
  }

  validarPermisosCarnet() {
    if (
      this.auth.user.rol == "ADMIN" ||
      this.auth.user.rol == "ADMIN_OPERACIONES" ||
      this.auth.user.rol == "OPERACIONES" ||
      this.auth.user.rol == "AUDITORIA" ||
      this.auth.user.rol == "TEC_BANCA_DIGITAL"
    ) {
      //
      this.permisosBloqueoCarnet = true;
      this.permisosDesactivarServicio = true;
    } else {
      this.permisosDesactivarServicio = false;
      this.permisosBloqueoCarnet = false;
    }
  }

  buscarParametrosCarnet() {
    //
    this.validando = true;
    this.validarPermisosCarnet();
    this.service.buscarParametrosTransporte(this.id).subscribe((response) => {
      let parametros: any = response;

      if (
        parametros.id != null &&
        parametros.id != undefined &&
        parametros.id != ""
      ) {
        this.servicioTransporteActivo = true;
        this.qrPrevio = parametros.qr;
        this.parametrosPasajero = parametros;
        if (parametros.activo) {
          this.servicioTransporteDesactivado = false;
        } else {
          this.servicioTransporteDesactivado = true;
        }
        if (parametros.carnetCreado) {
          this.poseeCarnet = true;
          this.validando = false;
          this.carnetCreado = parametros.bloqueado;
          this.parametrosPasajero = parametros;
        } else if (!parametros.carnetCreado) {
          this.poseeCarnet = false;
          this.validando = false;
          this.mostrarErroresCarnet("carnet-no-creado");
        }
      } else {
        this.servicioTransporteActivo = false;
        this.servicioTransporteDesactivado = true;
        this.validando = false;
        this.mostrarErroresCarnet("parametros");
      }
    });
  }

  validarDesactivacionServicioTransporte(event) {
    this.validando = true;
    this.validarPermisosCarnet();
    if (this.permisosDesactivarServicio) {
      if (this.servicioTransporteActivo) {
        let mensaje;
        if (event) {
          mensaje =
            "¿Está seguro que desea desactivar el servicio de transporte para este usuario?";
        } else {
          mensaje =
            "¿Está seguro que desea activar el servicio de transporte para este usuario?";
        }
        this.dialog
          .open(AlertDialogComponent, {
            data: {
              title: "ALERTA",
              message: mensaje,
              yes: "Aceptar",
              no: "Cancelar",
            },
          })
          .afterClosed()
          .subscribe((result) => {
            if (result == 1) {
              let activar: boolean;
              let qrAGuardar: string;

              if (event) {
                activar = false;
                qrAGuardar = this.qrPrevio;
              } else {
                activar = true;
                let segmentosQR: string[] = this.qrPrevio.split("/");
                let max = (segmentosQR[1] + "/").concat(
                  segmentosQR[2] + "/"
                ).length;
                let nuevoIdQr = this.service.makeid(max);
                qrAGuardar = (segmentosQR[0] + "/")
                  .concat(segmentosQR[1] + "/")
                  .concat(segmentosQR[2] + "/")
                  .concat(nuevoIdQr + "/");
              }
              this.service
                .activarDesacivarServicioTransporte(
                  this.parametrosPasajero.id,
                  activar,
                  this.afiliado.usuario,
                  qrAGuardar
                )
                .subscribe((result) => {
                  let resp: any = result;
                  this.validando = false;
                  // if(resp.id != null && resp.bloqueado == event)
                  // {
                  this.validando = false;
                  if (event) {
                    mensaje =
                      "Desactivación de servicio para pago de transporte exitoso";
                  } else {
                    mensaje =
                      "Activación de servicio para pago de transporte exitoso";
                  }
                  this.dialog
                    .open(AlertDialogComponent, {
                      data: {
                        title: "COMPLETADO",
                        message: mensaje,
                        yes: "Aceptar",
                      },
                    })
                    .afterClosed()
                    .subscribe((result) => {
                      //console.log("afterclosed!",result);
                      //this.listaEstatus.close();
                      //this.permisos = false;
                    });
                  //}
                });
            } else {
              this.validando = false;
              if (event) {
                this.servicioTransporteDesactivado = false;
              } else {
                this.servicioTransporteDesactivado = true;
              }
            }
          });
      }
    }
  }

  validarParametrosTransporte(event) {
    this.validando = true;
    this.validarPermisosCarnet();
    if (this.permisosDesactivarServicio) {
      if (this.parametrosPasajero.carnetCreado) {
        let mensaje;
        if (event) {
          mensaje = "¿Está seguro que desea bloquear el carnet del usuario?";
        } else {
          mensaje = "¿Está seguro que desea desbloquear el carnet del usuario?";
        }
        this.dialog
          .open(AlertDialogComponent, {
            data: {
              title: "ALERTA",
              message: mensaje,
              yes: "Aceptar",
              no: "Cancelar",
            },
          })
          .afterClosed()
          .subscribe((result) => {
            if (result == 1) {
              this.service
                .bloquearDesbloquearCarnetTransporte(
                  this.parametrosPasajero.id,
                  event,
                  this.id
                )
                .subscribe((result) => {
                  let resp: any = result;

                  this.validando = false;
                  // if(resp.id != null && resp.bloqueado == event)
                  // {
                  this.validando = false;
                  if (event) {
                    mensaje =
                      "Bloqueo de carnet PDF (físico) para pago de transporte exitoso";
                  } else {
                    mensaje =
                      "Desbloqueo de carnet PDF (físico) para pago de transporte exitoso";
                  }
                  this.dialog
                    .open(AlertDialogComponent, {
                      data: {
                        title: "COMPLETADO",
                        message: mensaje,
                        yes: "Aceptar",
                      },
                    })
                    .afterClosed()
                    .subscribe((result) => {
                      //console.log("afterclosed!",result);
                      //this.listaEstatus.close();
                      //this.permisos = false;
                    });
                  //}
                });
            } else {
              this.validando = false;
              if (event) {
                this.carnetCreado = false;
              } else {
                this.carnetCreado = true;
              }
            }
          });
      } else if (!this.carnetCreado) {
        this.poseeCarnet = false;
        this.carnetCreado = !event;
        this.validando = false;
        this.mostrarErroresCarnet("carnet-no-creado");
      }
    } else {
      this.validando = false;
      this.mostrarErroresCarnet("privilegios");
    }
  }

  //detallar
  chequearDireccion() {
    if (this.afiliado.region == null || this.afiliado.region == undefined) {
      this.afiliado.region = {
        region: "NO ESPECIFICADO",
      };
    }
    if (
      this.afiliado.municipio == null ||
      this.afiliado.municipio == undefined
    ) {
      this.afiliado.municipio = {
        municipio: "NO ESPECIFICADO",
      };
    }
    if (this.afiliado.calle == null || this.afiliado.calle == undefined) {
      this.afiliado.calle = "NO ESPECIFICADO";
    }
    if (
      this.afiliado.pto_referencia == null ||
      this.afiliado.pto_referencia == undefined
    ) {
      this.afiliado.pto_referencia = "NO ESPECIFICADO";
    }
    if (this.afiliado.estado == null || this.afiliado.estado == undefined) {
      this.afiliado.estado = {
        estado: "NO ESPECIFICADO",
      };
    }
    if (
      this.afiliado.parroquia == null ||
      this.afiliado.parroquia == undefined
    ) {
      this.afiliado.parroquia = {
        parroquia: "NO ESPECIFICADO",
      };
    }
    if (
      this.afiliado.casa_edificio == null ||
      this.afiliado.casa_edificio == undefined
    ) {
      this.afiliado.casa_edificio = "NO ESPECIFICADO";
    }
    if (this.afiliado.piso == null || this.afiliado.piso == undefined) {
      this.afiliado.piso = "NO ESPECIFICADO";
    }
    if (this.afiliado.ciudad == null || this.afiliado.ciudad == undefined) {
      this.afiliado.ciudad = {
        ciudad: "NO ESPECIFICADO",
      };
    }
    if (this.afiliado.sector == null || this.afiliado.sector == undefined) {
      this.afiliado.sector = {
        zona: "NO ESPECIFICADO",
        codigo_postal: "NO ESPECIFICADO",
      };
    }
  }

  validarPermisos() {
    if (
      this.auth.user.rol == "ADMIN" ||
      this.auth.user.rol == "ADMIN_OPERACIONES" ||
      this.auth.user.rol == "OPERACIONES"
    ) {
      //
      //console.log("permite cambio de estatus");
      this.permisos = true;
    } else {
      //console.log("no permite cambio de estatus");
      this.permisos = false;
    }
  }

  mostrarErroresCarnet(origen: string) {
    let mensaje: string;
    //this.permisosBloqueoCarnet = false;
    switch (origen) {
      case "privilegios":
        mensaje =
          "No tiene privilegios para bloquear/desbloquear el carnet PDF (físico) de este usuario.";
        break;
      case "carnet-no-creado":
        mensaje =
          "El usuario no generó el carnet PDF (físico) para el pago de transporte.";
        break;
      case "parametros":
        mensaje =
          "El usuario no tiene configurado los parámetros para el servicio de pago de transporte.";
        break;
    }
    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: "AVISO",
          message: mensaje,
          yes: "Aceptar",
        },
      })
      .afterClosed()
      .subscribe((result) => {
        //console.log("afterclosed!",result);
        //this.listaEstatus.close();
        //this.permisos = false;
      });
  }

  mostrarErrorPermisos() {
    if (
      this.auth.user.rol == "ADMIN" ||
      this.auth.user.rol == "ADMIN_OPERACIONES" ||
      this.auth.user.rol == "OPERACIONES"
    ) {
      //
      console.log("permite cambio de estatus");
    } else {
      this.dialog
        .open(AlertDialogComponent, {
          data: {
            title: "ERROR",
            message: "Disculpe, no tiene privilegios para realizar esta acción",
            yes: "Aceptar",
          },
        })
        .afterClosed()
        .subscribe((result) => {
          //console.log("afterclosed!",result);
          //this.listaEstatus.close();
          //this.permisos = false;
        });
    }
  }

  mostrarCuentasBancarias() {
    this.validarPermisos();
    if (this.permisos) {
      this.dialog
        .open(InformacionFinancieraDialogComponent, {
          width: "575px",
          data: {
            title: "Cuentas Bancarias",
            cuentas: this.afiliado.cuentas,
            mensajeBoton: "Volver",
            tipoPersona: this.afiliado.tipoPersona,
          },
        })
        .afterClosed()
        .subscribe((result) => {});
    } else {
      this.mostrarErrorPermisos();
    }
  }

  mostrarListaRecaudos() {
    this.validarPermisos();
    if (this.permisos) {
      this.dialog
        .open(ListaRecaudosDialogComponent, {
          width: "450px",
          data: {
            id: this.afiliado.id,
            title: "Recaudos",
            recaudos: this.afiliado.recaudos,
            guardar: "Guardar",
            volver: "Volver",
          },
        })
        .afterClosed()
        .subscribe((result) => {
          //console.log("==>",result)
          //this.afiliado.recaudos = result
          if (result != null) {
            for (let i = 0; i < this.afiliado.recaudos.length; i++) {
              this.afiliado.recaudos[i].cambiado = false;
            }
            this.afiliado.recaudos = result;
          } else {
            for (let i = 0; i < this.afiliado.recaudos.length; i++) {
              this.afiliado.recaudos[i].cambiado = false;
            }
            console.log("no se va a cambiar nada");
          }
        });
    } else {
      this.mostrarErrorPermisos();
    }
  }

  transformaStringBool(obj): boolean {
    if (typeof obj == "boolean") {
      return obj;
    } else if (typeof obj == "string") {
      if (obj == "true") {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("Falla en Transformacion a boolean");
    }
  }

  mostrarDetallesDcard() {
    this.validarPermisos();
    if (this.permisos) {
      if (this.dcard === undefined) {
        this.dialog
          .open(AlertDialogComponent, {
            data: {
              title: "ALERTA",
              message: "No tiene DCARD disponible",
              yes: "Aceptar",
            },
          })
          .afterClosed()
          .subscribe((result) => {});
      } else {
        this.dialog
          .open(DcardDialogComponent, {
            width: "1175px",
            data: {
              title: "Información de D-card",
              dcard: this.dcard,
              staPan: this.staPan,
              afiliado: this.afiliado,
              mensajeBoton: "Volver",
            },
          })
          .afterClosed()
          .subscribe((result) => {});
      }
    } else {
      this.mostrarErrorPermisos();
    }
  }

  guardar() {
    if (this.afiliado.liqAuto == "true" || this.afiliado.liqAuto == true) {
      const porcOk = this.revisarPorcentajes();
      if (porcOk) {
        // se mapea para enviar solo id y porcLiqAuto
        let cuentas = this.cuentas.map((cuenta) => {
          return {
            id: cuenta.id,
            porcLiqAuto:
              typeof cuenta.porcLiqAuto == "string" &&
              cuenta.porcLiqAuto.includes(",")
                ? cuenta.porcLiqAuto.replace(",", ".")
                : cuenta.porcLiqAuto,
          };
        });
        this.openDialog(cuentas);
      } else {
        this.dialogService
          .showCompleteDialog(
            "Afiliado",
            "Se ha detectado un error al guardar los porcentajes de las cuentas estos deben sumar 100,00"
          )
          .then((result) => {});
      }
    } else {
      this.openDialog(undefined);
    }
  }

  openDialog(cuentas: any[]): void {
    if (this.afiliado.actividad && this.afiliado.id_act_ec == undefined) {
      this.afiliado.id_act_ec = this.afiliado.actividad.id;
    } else if (
      this.afiliado.actividad &&
      this.afiliado.id_act_ec != undefined
    ) {
    } else if (
      this.afiliado.actividad == undefined &&
      this.afiliado.id_act_ec == undefined
    ) {
      this.afiliado.id_act_ec = undefined;
    }

    let dialogRef = this.dialog.open(UpdateAfiliadosComponent, {
      width: "450px",
      data: {
        id: this.afiliado.id,
        estatus: this.afiliado.estatus,
        idActEc: this.afiliado.id_act_ec, // revisar condiciones
        liqAuto: this.transformaStringBool(this.afiliado.liqAuto),
        cuentas: cuentas,
        identificacion: this.afiliado.identificacion,
        //recaudos: this.recaudos,
        loading: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("Cerrado!");
      this.service
        .updateAfiliadoAci(this.afiliado.id, this.selected_aci)
        .subscribe(
          (res: any) => {
            if (res.mensaje === "Editado!") {
              this.aci_user = this.aci[this.selected_aci - 1];
            }
          },
          (err) => {
            console.log(err);
          }
        );
      if (result != -1) {
        this.router.navigate(["/portal/afiliados"]);
      }
    });
  }

  // autocomplete
  selectEventCategoria(item) {
    if (item.id == 1) {
      this.afiliado.id_act_ec = item.id;
      this.afiliado.actividad = undefined;

      this.esUnico = true;
    } else {
      this.esUnico = false;
    }
    // do something with selected item
  }

  onChangeSearchCategoria(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.afiliado.actividad = undefined;
    this.afiliado.id_act_ec = undefined;
  }

  onFocusedCategoria(e) {
    // do something when input is focused
  }

  onClearCategoria(e) {
    this.afiliado.categoria = undefined;
    this.afiliado.actividad = undefined;
    this.afiliado.id_act_ec = undefined;
  }

  onClosedCategoria(event) {
    // revisar el input y borrar si no hay match
    if (typeof this.afiliado.categoria != "object") {
      this.afiliado.categoria = undefined;
      this.afiliado.actividad = undefined;
    } else {
      this.subCategorias = this.actividades.filter(
        (a) => a.id_padre == this.afiliado.categoria.id
      );
    }
  }

  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  onClearSub(e) {}

  onClosed(event) {
    // revisar el input y borrar si no hay match
    if (typeof this.afiliado.actividad != "object") {
      this.afiliado.actividad = undefined;
      this.afiliado.id_act_ec = undefined;
    } else {
      this.afiliado.id_act_ec = this.afiliado.actividad.id;
    }
  }

  nombreRecaudo(idRecaudo: number): string {
    let nombreRecaudo: string;
    switch (idRecaudo) {
      case 1:
        nombreRecaudo = "RIF";
        return nombreRecaudo;
      case 2:
        nombreRecaudo = "Registro Mercantil";
        return nombreRecaudo;
      case 3:
        nombreRecaudo = "Cédula de Identidad";
        return nombreRecaudo;
      case 4:
        nombreRecaudo = "Información Bancaria";
        return nombreRecaudo;
      case 5:
        nombreRecaudo = "Pasaporte";
        return nombreRecaudo;
      case 6:
        nombreRecaudo = "Información Bancaria";
        return nombreRecaudo;
      case 7:
        nombreRecaudo = "RIF";
        return nombreRecaudo;
      case 8:
        nombreRecaudo = "Foto ";
        return nombreRecaudo;
      case 9:
        nombreRecaudo = "Información Bancaria - Opcional ";
        return nombreRecaudo;
    }
    return null;
  }

  visualizarArchivo(index: number): void {
    let isImg;
    if (
      this.recaudos[index].archivo.substr(
        this.recaudos[index].archivo.length - 3
      ) == "pdf"
    ) {
      isImg = false;
    } else if (
      this.recaudos[index].archivo.substr(
        this.recaudos[index].archivo.length - 3
      ) == "jpg" ||
      this.recaudos[index].archivo.substr(
        this.recaudos[index].archivo.length - 3
      ) == "jpeg"
    ) {
      isImg = true;
    }
    this.dialog
      .open(VisualizarArchivoDialogComponent, {
        data: {
          title: "Visualizar recaudos",
          message: this.recaudos[index].archivo,
          recaudoObj: this.recaudos[index].recaudoObj,
          subjectsService: this.subjectsService,
          isImg: isImg,
        },
        width: "400px",
      })
      .afterClosed()
      .subscribe((option: string) => {
        if (option == "Validar") {
          this.recaudos[index].enterado = true;
        }
      });
  }
}

@Component({
  selector: "update-afiliado",
  templateUrl: "./update-afiliado.component.html",
  providers: [AfiliadosService],
})
export class UpdateAfiliadosComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateAfiliadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entornoService: EntornoService,
    private service: AfiliadosService
  ) {
    this.dialogRef.disableClose = true;
  }

  public mensaje_update: string;

  public actualizado: boolean = false;

  public loading: boolean = false;

  onNoClick(): void {
    this.dialogRef.close(-1);
  }

  update(id: number, estatus: string) {
    this.service
      .update(
        id,
        estatus,
        this.data.identificacion,
        this.data.idActEc,
        this.data.liqAuto,
        this.data.cuentas
        //this.data.recaudos
      )
      .subscribe(
        (response) => {
          this.mensaje_update = "Afiliado modificado con exito.";

          this.actualizado = true;

          this.loading = false;
        },
        (error) => {
          this.actualizado = true;

          if (error.error.mensaje) {
            this.mensaje_update = error.error.mensaje;
          }
        }
      );
  }
}
