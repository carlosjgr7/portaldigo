import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { UsuariosService } from './usuarios.service';

var element_data: any = [];

@Component({
  selector: 'app-usuarios-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [
    UsuariosService
  ]
})
export class CrearUsuarioComponent implements OnInit { 

  constructor(private ref: ChangeDetectorRef, 
    private entornoService: EntornoService, 
    private router: Router, 
    private service: UsuariosService, 
    private route: ActivatedRoute) {}

  public global_alert = this.entornoService.pivot_msg;

  public usuario : any = {
    "usuario": "",
    "nombreCompleto": "",
    "correo": "",
    "estatus": true,
    "rol" : { "id" : "" }
  };

  public roles : any;

  public creado = false;
  public loading:boolean = false;

    ngOnInit() {

      this.service.roles().subscribe( response => {


        this.roles = response;

      }, error => {


      } );

      this.entornoService.hideAlert();
    }

    crear () : void {
      this.loading=true;
      if (this.usuario.estatus) { 

        this.usuario.estatus = "A";

      } else {

        this.usuario.estatus = "I";

      }
      if(this.usuario.usuario!= null){
        this.usuario.usuario = this.entornoService.limpiarCampo(this.usuario.usuario.toString(),"texto");
    
      }
      if(this.usuario.nombreCompleto != null){
        this.usuario.nombreCompleto= this.entornoService.limpiarCampo(this.usuario.nombreCompleto.toString(),"filtro");
    
      }
      if(this.usuario.correo != null){
        this.usuario.correo = this.entornoService.limpiarCampo(this.usuario.correo.toString(),"correo");
    
      }            

      if (this.usuario.usuario == "" || this.usuario.usuario.trim() == 0) {
        this.loading=false;

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el usuario.";
      } 
      else if (this.usuario.nombreCompleto == "" || this.usuario.nombreCompleto.trim() == 0) {
        this.loading=false;

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el nombre.";

       }else if ( this.usuario.nombreCompleto!=null && 
        (this.usuario.nombreCompleto.substring(0,1)==" " || this.usuario.nombreCompleto.substring(this.usuario.nombreCompleto.length-1, this.usuario.nombreCompleto.length)==" ")){
          this.loading=false;

          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje = "El nombre no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
  
        }  else if (this.usuario.correo == "" || this.usuario.correo.trim() == 0) {
          this.loading=false;

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el correo.";

      } else if (this.usuario.rol.id == "") {
        this.loading=false;

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe seleccionar el rol de usuario.";

      } else {

        this.service.create(this.usuario).subscribe( response  => {
          this.loading=false;

    
          this.global_alert.act = true;
          this.global_alert.type = "alert-success";
          this.global_alert.mensaje = "Usuario " + this.usuario.usuario + " creado con exito.";

          this.entornoService.hideAlert();

          this.router.navigate(['/portal/usuarios']);

        }, error => {
          this.loading=false;

          if (error.status == 401) {

            this.entornoService.clearSession();
    
            this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
    
            this.router.navigate(['/']);
          }

          if ( error.status == 500 ) {

            this.global_alert.act = true;
            this.global_alert.type = "alert-danger";
            this.global_alert.mensaje = "Usuario: " + this.usuario.usuario + " ya existe en la base de datos.";

            this.entornoService.hideAlert();
          } 
          else {

            this.global_alert.act = true;
            this.global_alert.type = "alert-danger";
            this.global_alert.mensaje = error.error.mensaje;

            this.entornoService.hideAlert();
          }
        });
      }
    }

}

