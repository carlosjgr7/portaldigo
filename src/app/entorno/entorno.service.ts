import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import "rxjs/Rx";

import { environment } from "../../environments/environment";

import BigNumber from "bignumber.js";

@Injectable()
export class EntornoService {
  public usuario: string = "0";
  public token: string = "0";
  public ultima_conexion: any;
  public nombre_completo: string;
  public esCampoTarifa: boolean = false;

  public alertaAPIV2: boolean;

  public caduco_sesion: string;

  public fechaInicio: string = "";

  public pivot_msg: any = {
    act: false,
    type: "0",
    mensaje: "",
  };

  public parametros: any = [];

  public last_page: any = null;

  constructor(private http: HttpClient, private router: Router) {
    //this.pullToken ();
  }
  /********************************************************************/
  /********************************Limpieza final de campos*******************/
  limpiarCampo(valor, origen) {
    if (origen == "texto-espacio") {
      let campo = valor.replace(/[^A-Za-z0-9 ]/g, "");
      var end = campo.length;

      if (campo.substring(0, 1) == " ") {
        campo = campo.slice(0, -1);
        return campo;
      } else if (
        campo.substring(end - 2, end - 1) == " " &&
        campo.substring(end - 1, end) == " "
      ) {
        campo = campo.slice(0, -1);
        return campo;
      } else {
        return campo;
      }
    } else if (origen == "texto") {
      return valor.replace(/[^A-Za-z0-9]/g, "");
    } else if (origen == "contrasena") {
      return valor.replace(/[^A-Za-z0-9,._!?+@#$%&*-]*/g, "");
    } else if (origen == "numeros") {
      return valor.replace(/[^0-9]*/g, "");
    } else if (origen == "solo-texto") {
      return valor.replace(/[^A-Za-z]*/g, "");
    } else if (origen == "solo-texto-espacio") {
      let campo = valor.replace(/[^A-Za-z ]*/g, "");
      var end = campo.length;

      if (campo.substring(0, 1) == " ") {
        campo = campo.slice(0, -1);
        return campo;
      } else if (
        campo.substring(end - 2, end - 1) == " " &&
        campo.substring(end - 1, end) == " "
      ) {
        campo = campo.slice(0, -1);
        return campo;
      } else {
        return campo;
      }
    } else if (origen == "correo") {
      return valor.replace(/[^A-Za-z0-9,._@*-]*/g, "");
    } else if (origen == "filtro") {
      return valor.replace(/[^A-Za-z0-9 ,.:;_/!@#$~&-]*/g, "");
    }
  }
  formatearMonto(lista, proiedad) {
    for (let i = 0; i < lista.length; i++) {
      lista[i][proiedad] = this.pipeDecimalBigNumber(
        lista[i][proiedad].toString()
      );
    }
    return lista;
  }

  limpiarMonto(montoDecimal) {
    let monto = montoDecimal;
    if (monto.trim().length > 0) {
      monto = new BigNumber(montoDecimal.replace(/[^0-9]/g, ""))
        .div(100)
        .toString();
    }
    return monto;
  }

  pipeDecimalBigNumber(monto) {
    let fmt = {
      prefix: "",
      decimalSeparator: ",",
      groupSeparator: ".",
      groupSize: 3,
      secondaryGroupSize: 3,
    };

    let amount = new BigNumber(monto).toFormat(2, fmt);

    return amount;
  }

  inicializar(token: string) {
    this.token = token;
  }

  iniciarSesion(usuario: string, contrasena: string) {
    this.usuario = usuario;

    const body = {};
    return this.http.post(
      environment.urlApi +
        "/instituciones/" +
        environment.idInstitucion +
        "/administradores/" +
        usuario +
        "/inicio-sesion?canal=" +
        environment.idCanal,
      body,
      {
        headers: new HttpHeaders({
          Authorization: "Basic " + btoa(usuario + ":" + contrasena),
        }),
        observe: "response",
      }
    );
  }

  cerrarSesion() {
    var auth: any = this.auth();

    if (auth.auth) {
      const options = {
        headers: new HttpHeaders({ "X-Auth-Token": auth.user.token }),
      };

      var usuario = auth.user.usuario;

      this.clearSession();

      return this.http.post(
        environment.urlApi +
          "/instituciones/" +
          environment.idInstitucion +
          "/administradores/" +
          usuario +
          "/cierre-sesion?fechaInicio=" +
          this.fechaInicio,
        null,
        options
      );
    } else {
      this.clearSession();

      this.caduco_sesion = "Su sesion ha expirado, ingrese nuevamente.";

      this.router.navigate(["/"]);
    }
  }

  public pullToken() {
    return this.token;
  }

  public pullUser() {
    return this.usuario;
  }

  public setSession(
    token: string,
    usuario: string,
    nombre_completo: string,
    ultima_conexion: string,
    rol: any,
    id: any
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("nombre_completo", nombre_completo);
    /*if(ultima_conexion == undefined || ultima_conexion == null){
            var currentdate = new Date(); 
            var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate()+ "T"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "."
                + currentdate.getMilliseconds() ; 
                console.log(datetime)
                localStorage.setItem("ultima_conexion", datetime.toString());
        }else{

        }*/
    localStorage.setItem("ultima_conexion", ultima_conexion);

    localStorage.setItem("rol", rol);
    localStorage.setItem("id", id);
  }

  public clearSession() {
    this.parametros = []; ///clear params

    localStorage.clear();
  }

  public auth() {
    var auth = {};

    if (localStorage.getItem("token")) {
      auth = {
        auth: true,
        user: {
          token: localStorage.getItem("token"),
          usuario: localStorage.getItem("usuario"),
          nombre_completo: localStorage.getItem("nombre_completo"),
          ultima_conexion: localStorage.getItem("ultima_conexion"),
          rol: localStorage.getItem("rol"),
          id: localStorage.getItem("id"),
        },
      };
    } else {
      auth = { auth: false };
    }

    return auth;
  }

  hideAlert() {
    setTimeout(() => {
      //<<<---    using ()=> syntax
      this.pivot_msg.act = false;
    }, 3000);
  }

  datosApi() {
    let url = environment.urlBackendV2 + "pagos-masivos";

    return this.http.get(url).subscribe(
      (res: any) => {
        console.log(res);
        this.alertaAPIV2 = true;
      },
      (err) => {
        console.log(err);
        this.alertaAPIV2 = false;
      }
    );
  }
}
