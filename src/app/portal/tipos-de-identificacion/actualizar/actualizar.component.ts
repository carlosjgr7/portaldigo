import { Component, OnInit, Inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { ActualizarTipoDeIdentificacionService } from './actualizar.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var element_data: any = [];

@Component({
  selector: 'app-tipo-de-identificacion-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss'],
  providers: [
  	ActualizarTipoDeIdentificacionService
  ]
})
export class ActualizarTiposDeIdentificacionComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private actualizar: ActualizarTipoDeIdentificacionService, private route: ActivatedRoute, public dialog: MatDialog) {}


	public tipos_identificacion : any  = {
		"tipoPersona" : '',
		"codigo" : '',
		"descripcion" : '',
		"activo" : false,
	};
	public mensaje : string;
	public mensaje_success : string;

	public actualizado : boolean = false;
	public loading : boolean = false;

	private id : any = this.route.snapshot.params['id'];

	  ngOnInit() {

		this.loading = true;
	    this.actualizar.getTipoDeIdentificacion(this.id).subscribe( response => {

	  	this.tipos_identificacion = response;
		this.loading = false;	
	  	}, error => {

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );	


	}

	private existeTipoIdentificacion ( tipo:string ): boolean {
		return false;
	}

	openDialog () {
		if(this.tipos_identificacion.tipoPersona != null){
			this.tipos_identificacion.tipoPersona = this.entornoService.limpiarCampo(this.tipos_identificacion.tipoPersona.toString(),"texto");
	
			}
		if(this.tipos_identificacion.codigo != null){
			this.tipos_identificacion.codigo = this.entornoService.limpiarCampo(this.tipos_identificacion.codigo.toString(),"filtro");
	
			}

		if ( this.tipos_identificacion.tipoPersona == '' || this.tipos_identificacion.tipoPersona.trim() == 0) {

			this.mensaje = "Debe seleccionar el tipo de persona";

		}else if(this.tipos_identificacion.codigo == '' || this.tipos_identificacion.codigo.trim() == 0){
			this.mensaje = "Debe escribir el código";

		}else if(this.tipos_identificacion.descripcion == '' || this.tipos_identificacion.descripcion.trim() == 0){
			this.mensaje = "Debe escribir la descripción";
		}else if ( this.tipos_identificacion.descripcion!=null && 
			(this.tipos_identificacion.descripcion.substring(0,1)==" " ||  this.tipos_identificacion.descripcion.substring( this.tipos_identificacion.descripcion.length-1, this.tipos_identificacion.descripcion.length)==" ")){
			  this.mensaje ="La descripción de la identificación no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
		  	}  else {

			if ( this.existeTipoIdentificacion( this.tipos_identificacion.tipoPersona ) ) {

				this.mensaje = "Este tipo de identificación, ya existe.";

			} else {

				let dialogRef = this.dialog.open(UpdateTipoIdentificacionComponent, {
					width: '450px',
					data: { id: this.id, tipos_identificacion: this.tipos_identificacion }
				});
			  
				  dialogRef.afterClosed().subscribe(result => {
					console.log('The dialog was closed');
					this.router.navigate(['/portal/catalogo/tipos-de-identificacion']);
				  });

			}

		}
	}

	update () {

		if ( this.tipos_identificacion.tipoPersona == '' || this.tipos_identificacion.tipoPersona.trim() == 0) {

			this.mensaje = "Debe seleccionar el tipo de persona";

		}else if(this.tipos_identificacion.codigo == '' || this.tipos_identificacion.codigo.trim() == 0){
			this.mensaje = "Debe escribir el código";

		}else if(this.tipos_identificacion.descripcion == '' || this.tipos_identificacion.descripcion.trim() == 0){
			this.mensaje = "Debe escribir la descripción";
		} else {

			if ( this.existeTipoIdentificacion( this.tipos_identificacion.tipoPersona ) ) {

				this.mensaje = "Este tipo de identificación, ya existe.";

			} else {

				this.actualizar.actualizarTiposDeIdentificacion( this.id, this.tipos_identificacion.tipoPersona, this.tipos_identificacion.codigo, this.tipos_identificacion.descripcion, this.tipos_identificacion.activo ).subscribe (
					response => {

						if ( response.status ) {

							this.mensaje_success = "Tipo de identificacion modificado con exito.";

							this.mensaje = null;

							this.actualizado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Tipo de identificacion " + this.tipos_identificacion.descripcion + " ha sido modificado con exito.";


							this.router.navigate(['/portal/catalogo/tipos-de-identificacion']);

							//setTimeout(function(){ this.router.navigate(['/portal/catalogo/palabras-reservadas']); }, 3000);

						}

					},
					error => {

						if (error.status == 401) {

					        this.entornoService.clearSession();

					        this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

					        this.router.navigate(['/']);

					    }

						if (error.error.mensaje) {
				          this.mensaje = error.error.mensaje;
				        }

					} 
				);

			}

	}

}
}

@Component({
	selector: 'update-tipo',
	templateUrl: './update-tipo.component.html',
	providers: [
		ActualizarTipoDeIdentificacionService
	]
  })
  export class UpdateTipoIdentificacionComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdateTipoIdentificacionComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private entornoService: EntornoService,
	  private service: ActualizarTipoDeIdentificacionService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
	public loading : boolean = false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( id:number, tipos_identificacion: any ) {
		this.loading = true;
		this.service.actualizarTiposDeIdentificacion( id, tipos_identificacion.tipoPersona, tipos_identificacion.codigo, tipos_identificacion.descripcion, tipos_identificacion.activo ).subscribe (
			response => {
				this.loading = false;
				this.actualizado = true;

				if ( response.status ) {

					this.mensaje_update = "Modificacion exitosa";

				}

			},
			error => {

				this.actualizado = true;
				this.loading = false;
				if (error.status == 401) {

					this.mensaje_update = "Su sesion ha expirado.";

				}

				if (error.error.mensaje) {
				  this.mensaje_update = error.error.mensaje;
				}

			} 
		);
  
	}
	
  
}

