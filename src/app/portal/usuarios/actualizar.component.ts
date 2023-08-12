import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { UsuariosService } from './usuarios.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var element_data: any = [];

@Component({
  selector: 'app-usuarios-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [
    UsuariosService
  ]
})
export class ActualizarUsuarioComponent implements OnInit { 

  constructor(private ref: ChangeDetectorRef, 
    private entornoService: EntornoService, 
    private router: Router, 
    private service: UsuariosService, 
    private route: ActivatedRoute,
    public dialog: MatDialog) {}

  public global_alert = this.entornoService.pivot_msg;
  public rol : any;
  public usuario : any = {
    "id" : this.route.snapshot.params['id'],
    "usuario": "",
    "nombreCompleto": "",
    "correo": "",
    "estatus": true,
    "rol" : {}
  };

  private id : any = this.route.snapshot.params['id'];

  public actualizado : boolean = false;

  public roles : any;

  public load : boolean = false;

  public loading : boolean = true;

    ngOnInit() {
      this.service.roles().subscribe( response => {


        this.roles = response;

      }, error => {


      } );


      this.service.getUsuario(this.id).subscribe( response => {

        this.usuario = response;


        if ( this.usuario.estatus == "A" ) {

          this.usuario.estatus = true;

        } else {

          this.usuario.estatus = false;

        }

        this.load = true;
        this.rol = this.usuario.rol.id.toString();
        this.loading = false;

      }, error => {} );

    }

    openDialog () {

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

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el usuario.";

      } else if (this.usuario.nombreCompleto == "" || this.usuario.nombreCompleto.trim() == 0) {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el nombre.";

       }else if ( this.usuario.nombreCompleto!=null && 
        (this.usuario.nombreCompleto.substring(0,1)==" " || this.usuario.nombreCompleto.substring(this.usuario.nombreCompleto.length-1, this.usuario.nombreCompleto.length)==" ")){
          
          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje = "El nombre no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
  
        } else if (this.usuario.correo == ""  || this.usuario.usuario.trim() == 0) {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el correo.";

        this.entornoService.hideAlert();

      } else if (this.rol == "") {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el correo.";

        this.entornoService.hideAlert();

      } else {

        this.usuario.rol.id = parseInt(this.rol);

        let dialogRef = this.dialog.open(UpdateUsuarioComponent, {
					width: '450px',
					data: { usuario: this.usuario }
				});
			  
				  dialogRef.afterClosed().subscribe(result => {
				
					this.router.navigate(['/portal/usuarios']);
				  });

      }

    }

    update () {

      if (this.usuario.estatus) { 

        this.usuario.estatus = "A";

      } else {

        this.usuario.estatus = "I";

      }


      if (this.usuario.usuario == "") {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el usuario.";

        this.entornoService.hideAlert();

      } else if (this.usuario.nombreCompleto == "") {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el nombre.";

        this.entornoService.hideAlert();

      } else if (this.usuario.correo == "") {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el correo.";

        this.entornoService.hideAlert();

      } else if (this.rol == "") {

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "Debe escribir el correo.";

        this.entornoService.hideAlert();

      } else {

        this.usuario.rol.id = parseInt(this.rol);

/*
        this.service.update(this.usuario).subscribe( response  => {

          this.global_alert.act = true;
          this.global_alert.type = "alert-success";
          this.global_alert.mensaje = "Usuario " + this.usuario.usuario + " modificado con exito.";

          this.router.navigate(['/portal/usuarios']);

          this.entornoService.hideAlert();

        }, error => {

          if (error.status == 401) {

            this.entornoService.clearSession();
    
            this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
    
            this.router.navigate(['/']);
    
          }

          console.log(error.error);
            this.global_alert.act = true;
            this.global_alert.type = "alert-danger";
            this.global_alert.mensaje = error.error.mensaje;

            this.entornoService.hideAlert();

        });*/

      }

    }

}

@Component({
	selector: 'update-usuario',
	templateUrl: './update-usuario.component.html',
	providers: [
		UsuariosService
	]
  })
  export class UpdateUsuarioComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdateUsuarioComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private entornoService: EntornoService,
	  private service: UsuariosService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
  public loading: boolean = false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( usuario: any ) {
    this.loading = true;

		this.service.update(usuario).subscribe( response  => {
      this.loading = false;

      this.actualizado = true;

      this.mensaje_update = "Modificacion realizada con exito.";

    }, error => {
      this.loading = false;

      this.actualizado = true;
      this.mensaje_update = error.error.mensaje;

      if (error.status == 401) {

      }

    });
  
	}
	
  
}

