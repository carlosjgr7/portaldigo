import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { CrearPalabrasReservadasService } from './crear.service';

var element_data: any = [];

@Component({
  selector: 'app-palabras-reservadas-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [
  	CrearPalabrasReservadasService
  ]
})
export class CrearPalabrasReservadasComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private crearPalabraReservada: CrearPalabrasReservadasService, private route: ActivatedRoute) {}


	public palabra_reservada : any  = {"palabra":''};
	public mensaje : string;
	public mensaje_success : string;

	public creado : boolean = false;

	ngOnInit() {

	  	

	}

	private existePalabra ( palabra:string ): boolean {
		return false;
	}

	crear() {

		if(this.palabra_reservada.palabra != null){
			this.palabra_reservada.palabra = this.entornoService.limpiarCampo(this.palabra_reservada.palabra.toString(),"filtro");
	
			}
		if ( this.palabra_reservada.palabra == '' || this.palabra_reservada.palabra.trim() == 0) {

			this.mensaje = "Debe escribir la palabra reservada.";

		}else if ( this.palabra_reservada.palabra !=null && 
			(this.palabra_reservada.palabra.substring(0,1)==" " ||  this.palabra_reservada.palabra.substring( this.palabra_reservada.palabra.length-1, this.palabra_reservada.palabra.length)==" ")){
			  this.mensaje ="La palabra reservada no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
		} else {

			if ( this.existePalabra( this.palabra_reservada.palabra ) ) {

				this.mensaje = "Esta palabra reservada, ya existe.";

			} else {

				this.crearPalabraReservada.crearPalabrasReservadas( this.palabra_reservada.palabra ).subscribe (
					response => {

						if ( response.status ) {

							this.mensaje_success = "Palabra reservada creada con exito.";

							this.mensaje = null;

							this.creado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Palabra " + this.palabra_reservada.palabra + " ha sido creado con exito.";


							this.router.navigate(['/portal/catalogo/palabras-reservadas']);

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

