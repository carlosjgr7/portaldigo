import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { CrearTiposDeIdentificacionService } from './crear.service';

var element_data: any = [];

@Component({
  selector: 'app-tipos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [
  	CrearTiposDeIdentificacionService
  ]
})
export class CrearTiposDeIdentificacionComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private crearTipoIdentificacion: CrearTiposDeIdentificacionService, private route: ActivatedRoute) {}


	public tipos_identificacion : any  = {
		"tipoPersona" : '',
		"codigo" : '',
		"descripcion" : '',
		"activo" : true,
	};
	public mensaje : string;
	public mensaje_success : string;

	public creado : boolean = false;
	public loading : boolean = false;

	ngOnInit() {

	  	

	}

	private existeTipoIdentificacion ( tipo:string ): boolean {
		return false;
	}

	crear() {

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
		  	} else {

			if ( this.existeTipoIdentificacion( this.tipos_identificacion.descripcion ) ) {

				this.mensaje = "El tipo especificado, ya existe.";

			} else {

				this.loading = true;
				this.crearTipoIdentificacion.crearBancos( this.tipos_identificacion.tipoPersona, this.tipos_identificacion.codigo, this.tipos_identificacion.descripcion, this.tipos_identificacion.activo ).subscribe (
					response => {
						this.loading = false;
						if ( response.status ) {

							this.mensaje_success = "Tipo de identificacion creado con exito.";

							this.mensaje = null;

							this.creado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Tipo de identificacion " + this.tipos_identificacion.descripcion + " ha sido creado con exito.";


							this.router.navigate(['/portal/catalogo/tipos-de-identificacion']);

							//setTimeout(function(){ this.router.navigate(['/portal/catalogo/palabras-reservadas']); }, 3000);

						}

					},
					error => {
						this.loading = false;
						if (error.status == 401) {

					        this.entornoService.clearSession();

					        this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

					        this.router.navigate(['/']);

					    }

						if (error.error.mensaje) {
				          this.mensaje = error.error.mensaje;
				        }

					} 
				)

			}

		}

  	}

}

