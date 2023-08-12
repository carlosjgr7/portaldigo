import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { CrearBancosService } from './crear.service';

var element_data: any = [];

@Component({
  selector: 'app-bancos-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [
  	CrearBancosService
  ]
})
export class CrearBancosComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private crearBanco: CrearBancosService, private route: ActivatedRoute) {}


	public banco : any  = {
    				"codigo": '',
    				"nombre" : '',
    				"nombreCorto" : '',
    				"activo" : true,
    				"servicios" : []
				};
	public mensaje : string;
	public mensaje_success : string;

	public creado : boolean = false;

	public P2P = false;
	public P2C = false;

	ngOnInit() {

	  	

	}

	private existeBanco ( banco:string ): boolean {
		return false;
	}

	crear() {
	

		if(this.banco.codigo != null){
			this.banco.codigo = this.entornoService.limpiarCampo(this.banco.codigo.toString(),"numeros");
	
			}
		if(this.banco.nombre != null){
			this.banco.nombre = this.entornoService.limpiarCampo(this.banco.nombre.toString(),"filtro");
	
			}
		if(this.banco.nombreCorto != null){
			this.banco.nombreCorto = this.entornoService.limpiarCampo(this.banco.nombreCorto.toString(),"filtro");
	
			}
		
		if ( this.banco.codigo == '' || this.banco.codigo.trim() == 0) {

			this.mensaje = "Debe escribir el codigo del banco.";

			} else if ( this.banco.nombre == ''  || this.banco.nombre.trim() == 0) {
			this.mensaje = "Debe escribir el nombre o razon social del banco.";
			}else if ( this.banco.nombre !=null && 
			(this.banco.nombre.substring(0,1)==" " ||  this.banco.nombre.substring( this.banco.nombre.length-1, this.banco.nombre.length)==" ")){
			  this.mensaje ="El nombre del banco no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
		  	}else if ( this.banco.nombreCorto == ''  || this.banco.nombreCorto.trim() == 0) {
			this.mensaje = "Debe escribir el nombre del banco.";
			}else if ( this.banco.nombreCorto !=null && 
			(this.banco.nombreCorto.substring(0,1)==" " ||  this.banco.nombreCorto.substring( this.banco.nombreCorto.length-1, this.banco.nombreCorto.length)==" ")){
			  this.mensaje ="El nombre corto del banco no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
		  }  else {

			if ( this.existeBanco( this.banco.palabra ) ) {

				this.mensaje = "El banco especificado, ya existe.";

			} else {

					

				if ( this.P2C ) {

					this.banco.servicios.push("P2C");

				}

				if ( this.P2P ) {

					this.banco.servicios.push("P2P");

				}

				this.crearBanco.crearBancos( this.banco.codigo, this.banco.nombre, this.banco.nombreCorto, this.banco.activo, this.banco.servicios ).subscribe (
					response => {

						if ( response.status ) {

							this.mensaje_success = "Banco creado con exito.";

							this.mensaje = null;

							this.creado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Banco " + this.banco.nombreCorto + " ha sido creado con exito.";

						

							this.router.navigate(['/portal/catalogo/bancos']);

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
				)

			}

		}

  	}

}

