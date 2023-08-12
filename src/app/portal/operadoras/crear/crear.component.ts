import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { CrearOperadorasService } from './crear.service';

var element_data: any = [];

@Component({
  selector: 'app-operadoras-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [
  	CrearOperadorasService
  ]
})
export class CrearOperadorasComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private crearPalabraReservada: CrearOperadorasService, private route: ActivatedRoute) {}


	public operadora : any  = {
    				"codigo": '',
    				"nombre" : '',
    				"activo" : ''
				}
	public mensaje : string;
	public mensaje_success : string;

	public creado : boolean = false;

	public checked : boolean = true;
	public loading : boolean = false;

	ngOnInit() {

	  	

	}

	private existeCodigo ( codigo:string ): boolean {
		return false;
	}

	crear() {

			if(this.operadora.codigo != null){
				this.operadora.codigo = this.entornoService.limpiarCampo(this.operadora.codigo.toString(),"numeros");
		
				}
			if(this.operadora.nombre != null){
				this.operadora.nombre = this.entornoService.limpiarCampo(this.operadora.nombre.toString(),"filtro");
		
				}
			if ( this.operadora.codigo == '' || this.operadora.codigo.trim() == 0) {

				this.mensaje = "Debe escribir el codigo de la operadora.";

			} else if ( this.operadora.nombre == ''  || this.operadora.nombre.trim() == 0) {
				this.mensaje = "Debe escribir el nombre de la operadora.";
			}else if ( this.operadora.nombre !=null && 
				(this.operadora.nombre.substring(0,1)==" " ||  this.operadora.nombre.substring( this.operadora.nombre.length-1, this.operadora.nombre.length)==" ")){
				this.mensaje ="El nombre de la operadora no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
			} else {

			if ( this.existeCodigo( this.operadora.codigo ) ) {

				this.mensaje = "Esta operadora, ya existe.";

			} else {

				if ( this.checked ) {

					this.operadora.activo = true;

				} else {

					this.operadora.activo = false;

				}
				this.loading = true;
				this.crearPalabraReservada.crearOperadora( this.operadora.codigo, this.operadora.nombre, this.operadora.activo ).subscribe (
					response => {
						this.loading = false;
						if ( response.status ) {

							this.mensaje_success = "Operadora creada con exito.";

							this.mensaje = null;

							this.creado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Operadora " + this.operadora.nombre + " ha sido creado con exito.";


							this.router.navigate(['/portal/catalogo/operadoras']);

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

