import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { environment } from "../../../environments/environment";

@Injectable()
export class AfiliadosService {
  constructor(private http: HttpClient) {}

  getAfiliados(
    tipo: string,
    filtro: string = null,
    ultimo: string = null,
    exportar: boolean = false
  ) {
    if (filtro != null && ultimo != null) {
      return this.http.get(
        environment.urlApi +
          "/instituciones/" +
          environment.idInstitucion +
          "/afiliados?tipo=" +
          tipo +
          "&filtro=" +
          filtro +
          "&ultimo=" +
          ultimo +
          "&exportar=" +
          exportar
      );
    }

    if (filtro == null && ultimo != null) {
      return this.http.get(
        environment.urlApi +
          "/instituciones/" +
          environment.idInstitucion +
          "/afiliados?tipo=" +
          tipo +
          "&ultimo=" +
          ultimo +
          "&exportar=" +
          exportar
      );
    }

    if (filtro != null && ultimo == null) {
      return this.http.get(
        environment.urlApi +
          "/instituciones/" +
          environment.idInstitucion +
          "/afiliados?tipo=" +
          tipo +
          "&filtro=" +
          filtro +
          "&exportar=" +
          exportar
      );
    }

    if (filtro == null && ultimo == null) {
      return this.http.get(
        environment.urlApi +
          "/instituciones/" +
          environment.idInstitucion +
          "/afiliados?tipo=" +
          tipo +
          "&exportar=" +
          exportar
      );
    }
  }

  getAfiliado(id: number) {
    return this.http.get(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        id
    );
  }

  getActividades() {
    return this.http.get<any[]>(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/actividades"
    );
  }

  getCuentaAfiliado(id: string) {
    let endPoint =
      environment.urlApi +
      "/instituciones/" +
      environment.idInstitucion +
      "/usuario/" +
      id +
      "/bancos-clientes";
    let params = new HttpParams();
    params = params.set("canal", environment.idCanal.toString());

    return this.http.get<any[]>(endPoint, { params: params });
  }

  update(
    id: number,
    estatus: string,
    idafi: string,
    idActEc?: number,
    liqAuto?: boolean,
    cuentas?: any[],
    recaudos?: any[]
  ) {
    let body = { estatus: estatus };
    if (idActEc) {
      body["id_act_ec"] = idActEc;
    }
    if (liqAuto != undefined) {
      body["liqAuto"] = liqAuto;
    }
    if (cuentas) {
      body["cuentas"] = cuentas;
    }
    if (idafi) {
      body["identificacion"] = idafi;
    }
    if (recaudos) {
      body["recaudos"] = recaudos;
    }

    return this.http.post(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        id,
      body,
      {
        observe: "response",
      }
    );
  }

  // updateEstatusAfliado(id: number, estatus:string, idafi: string, idActEc?: number, liqAuto?: boolean, cuentas?: any[])
  // {
  //   let body = { "estatus": estatus };
  //   if (idActEc) { body['id_act_ec'] = idActEc; }
  //   if (liqAuto != undefined) { body['liqAuto'] = liqAuto; }
  //   if (cuentas) { body['cuentas'] = cuentas; }
  //   if (idafi) { body['identificacion'] = idafi; }

  //   return this.http.post(environment.urlApi + '/instituciones/' + environment.idInstitucion + '/afiliados/actulaizar-estatus-afiliado/' + id, body, {
  //     observe: 'response'
  // });
  // }

  borrar(id: number) {
    return this.http.delete(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        id,
      {
        observe: "response",
      }
    );
  }

  buscarParametrosTransporte(id: number) {
    return this.http.get(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        id +
        "/obtener-parametros-transporte-afiliado"
    );
  }

  listarTipoRecaudos(tipoCliente: string) {
    return this.http.get(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/tiposRecaudos/" +
        tipoCliente.trim().toLowerCase()
    );
  }

  bloquearDesbloquearCarnetTransporte(
    idParametro: number,
    accion: boolean,
    idUsuario: string
  ) {
    let parametros = {
      id: idParametro,
      idUsuario: idUsuario,
      bloqueado: accion,
    };
    return this.http.post(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        idUsuario +
        "/bloq-desbloq-carnet-pasajero-portal?canal=" +
        environment.idCanal,
      parametros,
      {
        observe: "response",
      }
    );
  }

  activarDesacivarServicioTransporte(
    idParametro: number,
    accion: boolean,
    usuario: string,
    qr: string
  ) {
    let parametros = {
      id: idParametro,
      activo: accion,
      qr: qr,
    };
    return this.http.post(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        usuario +
        "/desactivar-servicio-pago-transporte-portal?canal=" +
        environment.idCanal,
      parametros,
      {
        observe: "response",
      }
    );
  }

  makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  guardarCambioEnRecaudos(idAfiliado: number, recaudos: any[]) {
    let body = { id: idAfiliado };
    body["recaudos"] = recaudos;
    let afiliado = {
      recaudos: recaudos,
    };
    return this.http.post(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/afiliados/" +
        idAfiliado +
        "/cambiar-estatus-recaudo",
      body,
      { observe: "response" }
    );
  }

  getAcis() {
    let urlApi = environment.urlBackendV2 + "aci";

    return this.http.get(urlApi);
  }

  getIdAcid(id_usuario) {
    let urlApi = environment.urlBackendV2 + "afiliados/" + id_usuario;

    return this.http.get(urlApi);
  }

  updateAfiliadoAci(id_usuario, id_aci) {
    let urlApi =
      environment.urlBackendV2 +
      "aci-afiliado/" +
      id_usuario +
      "?id_aci=" +
      id_aci;

    return this.http.put(urlApi, null);
  }

  getDcard(cond: any) {
    let urlApi = environment.urlBackendV2 + "dcard-data/" + cond;

    return this.http.get(urlApi);
  }

  getGestiones(tipo_persona: any) {
    let urlApi =
      environment.urlBackendV2 + "gestiones?tipo_persona=" + tipo_persona;

    return this.http.get(urlApi);
  }

  getGestion(id_usuario: any) {
    let urlApi = environment.urlBackendV2 + "gestion/" + id_usuario;

    return this.http.get(urlApi);
  }

  getGestionGral(id_usuario: any) {
    let urlApi = environment.urlBackendV2 + "gestion-gral/" + id_usuario;

    return this.http.get(urlApi);
  }

  noAprobarDcard(id, id_usuario, nota) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-no-aprobar/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota;

    return this.http.put(urlApi, null);
  }

  aprobarDcard(id, id_usuario, nota, option) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-aprobar/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&option=" +
      option +
      "&nota=" +
      nota;

    return this.http.put(urlApi, null);
  }

  recepDcard(pan, id_usuario) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-recep/" +
      pan +
      "?id_usuario=" +
      id_usuario;

    return this.http.get(urlApi);
  }

  recepDcardS(id_dcard, id_usuario) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-recep-s/" +
      id_dcard +
      "?id_usuario=" +
      id_usuario;

    return this.http.put(urlApi, null);
  }

  distriDcard(pan, id_usuario) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-distri/" +
      pan +
      "?id_usuario=" +
      id_usuario;

    return this.http.put(urlApi, null);
  }

  distrDcard(id, id_usuario, nota, tipo_envio, guia) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-distr/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&id_courrier=" +
      tipo_envio +
      "&nota=" +
      nota +
      "&guia=" +
      guia;

    return this.http.put(urlApi, null);
  }

  activarDcard(pan, cvv, f_venc, id_usuario) {
    let urlApi =
      environment.urlBackendV2 + "dcard-activacion?id_usuario=" + id_usuario;

    return this.http.put(urlApi, { pan, cvv, f_venc });
  }

  bloquearDcard(id, id_usuario, nota) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-bloquear/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota;

    return this.http.put(urlApi, null);
  }

  desbloquearDcard(id, id_usuario, nota) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-desbloquear/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota;

    return this.http.put(urlApi, null);
  }

  perdidaDcard(id, id_usuario, nota, option) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-perdida/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota +
      "&option=" +
      option;

    return this.http.put(urlApi, null);
  }

  roboDcard(id, id_usuario, nota, option) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-robo/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota +
      "&option=" +
      option;

    return this.http.put(urlApi, null);
  }

  deterioroDcard(id, id_usuario, nota, option) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-deterioro/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota +
      "&option=" +
      option;

    return this.http.put(urlApi, null);
  }

  generalDcard(id, id_usuario, nota) {
    let urlApi =
      environment.urlBackendV2 +
      "dcard-general/" +
      id +
      "?id_usuario=" +
      id_usuario +
      "&nota=" +
      nota;

    return this.http.post(urlApi, null);
  }

  getCourrier() {
    let urlApi = environment.urlBackendV2 + "courrier";

    return this.http.get(urlApi);
  }

  getReporte(tipo_persona) {
    let urlApi = environment.urlBackendV2 + "reporte";
    const headers = new HttpHeaders().set(
      "Content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return this.http.get(urlApi + "/" + tipo_persona, {
      headers,
      responseType: "blob" as "json",
    });
  }
}
