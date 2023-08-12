import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { UsuariosService } from './usuarios.service';

var element_data: any = [];

@Component({
  selector: 'app-usuarios-cambioclave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [
    UsuariosService
  ]
})
export class CambioClaveComponent implements OnInit { 

  constructor(private ref: ChangeDetectorRef, 
    private entornoService: EntornoService, 
    private router: Router, 
    private service: UsuariosService, 
    private route: ActivatedRoute) {}

  public global_alert = this.entornoService.pivot_msg;

  public clave : any = {
    canal : 1,
    contrasenaActual : "",
    contrasenaNueva : ""
  };

  public contrasenaNueva : string;

  public cambiado : boolean = false;
  public loading : boolean = false;
  ngOnInit() {
    
  }

  cambiar () {
    this.loading = true;
    if(this.clave.contrasenaActual!= null){
      this.clave.contrasenaActual = this.entornoService.limpiarCampo(this.clave.contrasenaActual.toString(),"contrasena");
  
      }
    if(this.clave.contrasenaNueva!= null){
      this.clave.contrasenaNueva = this.entornoService.limpiarCampo(this.clave.contrasenaNueva.toString(),"contrasena");
  
      }
    if(this.contrasenaNueva != null){
      this.contrasenaNueva  = this.entornoService.limpiarCampo(this.contrasenaNueva .toString(),"contrasena");
  
      }
    if ( this.clave.contrasenaActual == "" ) {

    } else if ( this.clave.contrasenaNueva == "" ) {

    } else if ( this.clave.contrasenaNueva != this.contrasenaNueva ) {

    } else if ( this.clave.contrasenaNueva == this.contrasenaNueva && this.clave.contrasenaActual != "" ) {

      this.service.cambioClave( this.clave ).subscribe ( response => {
        if(this.global_alert.act)
        {
          this.global_alert.act = false;
        }

        this.entornoService.clearSession();

        this.entornoService.caduco_sesion = 'Ingrese con su nueva contraseña.'

        this.router.navigate(['/']);

      }, error => {


        if (error.error.mensaje) {
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje = error.error.mensaje;
        }

        

        if (error.status == 401) {

          this.entornoService.clearSession();

          this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

          this.router.navigate(['/']);

        }

      } );

    }

  }

}

