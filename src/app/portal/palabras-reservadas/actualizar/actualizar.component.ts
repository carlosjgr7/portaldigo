import { Component, OnInit, Inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { ActualizarPalabrasReservadasService } from './actualizar.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var element_data: any = [];

@Component({
  selector: 'app-palabras-reservadas-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss'],
  providers: [
  	ActualizarPalabrasReservadasService
  ]
})
export class ActualizarPalabrasReservadasComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private actualizar: ActualizarPalabrasReservadasService, private route: ActivatedRoute, public dialog: MatDialog) {}


	public palabra_reservada : any  = {"palabra":''};
	public mensaje : string;
	public mensaje_success : string;

	public actualizado : boolean = false;

	private id : any = this.route.snapshot.params['id'];

	  ngOnInit() {

	    	
	    this.actualizar.getPalabraReservada(this.id).subscribe( response => {

	  	this.palabra_reservada = response;

	  	}, error => {

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			} else {
				this.entornoService.pivot_msg.act = true;

				this.entornoService.pivot_msg.type = "alert-danger";

				this.entornoService.pivot_msg.mensaje = "Ha ocurrido un error interno por favor intente mas tarde.";


				this.router.navigate(['/portal/catalogo/palabras-reservadas']);
			}

	    } );	


	}

	private existePalabra ( palabra:string ): boolean {
		return false;
	}

	openDialog () {

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

				let dialogRef = this.dialog.open(UpdatePalabraComponent, {
					width: '450px',
					data: { id: this.id, palabra: this.palabra_reservada }
				});
			  
				  dialogRef.afterClosed().subscribe(result => {
					console.log('The dialog was closed');
					this.router.navigate(['/portal/catalogo/palabras-reservadas']);
				  });

			}

	}

	}

	update () {

		if ( this.palabra_reservada.palabra == '' ) {

			this.mensaje = "Debe escribir la palabra reservada.";

		} else {

			if ( this.existePalabra( this.palabra_reservada.palabra ) ) {

				this.mensaje = "Esta palabra reservada, ya existe.";

			} else {

				this.actualizar.actualizarPalabrasReservadas( this.id, this.palabra_reservada.palabra ).subscribe (
					response => {

						if ( response.status ) {

							this.mensaje_success = "Palabra reservada modificada con exito.";

							this.mensaje = null;

							this.actualizado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Palabra " + this.palabra_reservada.palabra + " ha sido modificada con exito.";


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
				);

			}

	}

}
}


@Component({
	selector: 'update-palabra',
	templateUrl: './update-palabra.component.html',
	providers: [
		ActualizarPalabrasReservadasService
	]
  })
  export class UpdatePalabraComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdatePalabraComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private entornoService: EntornoService,
	  private service: ActualizarPalabrasReservadasService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( id:number, palabra: any ) {

		this.service.actualizarPalabrasReservadas( id, palabra.palabra ).subscribe (
			response => {

				if ( response.status ) {

					this.actualizado = true;

					this.mensaje_update = "Palabra reservada modificada con exito.";

				}

			},
			error => {

				if (error.status == 401) {

					this.actualizado = true;

					this.mensaje_update = "su sesion ha caducado.";

				}

				if (error.error.mensaje) {

					this.actualizado = true;
				  this.mensaje_update = error.error.mensaje;
				}

			} 
		);
  
	}
	
  
}
