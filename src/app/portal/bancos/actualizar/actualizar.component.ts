import { Component, OnInit, Inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EntornoService } from '../../../entorno/entorno.service';

import { ActualizarBancosService } from './actualizar.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var element_data: any = [];

@Component({
  selector: 'app-banco-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss'],
  providers: [
  	ActualizarBancosService
  ]
})
export class ActualizarBancosComponent implements OnInit { 

	constructor(private entornoService: EntornoService, 
		private router: Router, 
		private actualizar: ActualizarBancosService, 
		private route: ActivatedRoute,
		public dialog: MatDialog) {}


	public banco : any  = {
    				"codigo": '',
    				"nombre" : '',
    				"nombreCorto" : '',
    				"activo" : false,
    				"servicios" : []
				};
	public mensaje : string;
	public mensaje_success : string;

	public actualizado : boolean = false;

	private id : any = this.route.snapshot.params['id'];

	public P2P = false;
	public P2C = false;
	public loading: boolean = false

	  ngOnInit() {
		this.loading = true;
	    	
	    this.actualizar.getBanco(this.id).subscribe( response => {

	  	this.banco = response;
		this.loading = false;
	  	if ( this.banco.servicios[0] ) {

	  		for ( var i = 0; i < this.banco.servicios.length; i++ ) {
	  			
	  			if ( this.banco.servicios[i] == "P2P" ) {

	  				this.P2P = true;

	  			}

	  			if ( this.banco.servicios[i] == "P2C" ) {

	  				this.P2C = true;

	  			}

	  		}

	  	}

	  	this.banco.servicios = [];

	  	}, error => {

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			} else {

				this.entornoService.pivot_msg.act = true;

				this.entornoService.pivot_msg.type = "alert-danger";

				this.entornoService.pivot_msg.mensaje = "Ha ocurrido un error interno, por favor intente mas tarde.";

			

				this.router.navigate(['/portal/catalogo/bancos']);

			}



	    } );	


	}

	private existePalabra ( palabra:string ): boolean {
		return false;
	}

	openDialog () {

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
			
			if ( this.existePalabra( this.banco.palabra ) ) {

				this.mensaje = "El banco especificado, ya existe.";

			} else {
				if ( this.P2C ) {

					this.banco.servicios.push("P2C");

				}

				if ( this.P2P ) {

					this.banco.servicios.push("P2P");

				}


			}
			this.loading = true;
			let dialogRef = this.dialog.open(UpdateBancoComponent, {
				width: '450px',
				data: { id: this.id, banco: this.banco }
			});
		  
			  dialogRef.afterClosed().subscribe(result => {
				this.loading = false;
				console.log('The dialog was closed');
				this.router.navigate(['/portal/catalogo/bancos']);
			  });

		}

	}

	update () {

		if ( this.banco.codigo == '' ) {

			this.mensaje = "Debe escribir el codigo del banco";

		} else if ( this.banco.nombre == '' ) {
			this.mensaje = "Debe escribir el nombre o razon social del banco.";
		} else if ( this.banco.nombreCorto == '' ) {
			this.mensaje = "Debe escribir el nombre del banco.";
		}else {

			if ( this.existePalabra( this.banco.palabra ) ) {

				this.mensaje = "El banco especificado, ya existe.";

			} else {

				if ( this.P2C ) {

					this.banco.servicios.push("P2C");

				}

				if ( this.P2P ) {

					this.banco.servicios.push("P2P");

				}

				this.actualizar.actualizarBancos( this.id, this.banco.codigo, this.banco.nombre, this.banco.nombreCorto, this.banco.activo, this.banco.servicios ).subscribe (
					response => {

						if ( response.status ) {

							this.mensaje_success = "Banco modificado con exito.";

							this.mensaje = null;

							this.actualizado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Banco " + this.banco.nombreCorto + " ha sido modificado con exito.";

							

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
				);

			}

	}

}
}

@Component({
	selector: 'update-banco',
	templateUrl: './update-banco.component.html',
	providers: [
		ActualizarBancosService
	]
  })
  export class UpdateBancoComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdateBancoComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private entornoService: EntornoService,
	  private service: ActualizarBancosService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
	public loading: boolean = false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( id:number, banco: any ) {
		
		this.loading = true;
		this.service.actualizarBancos( 
			id, 
			banco.codigo, 
			banco.nombre,
			 banco.nombreCorto, 
			 banco.activo, 
			 banco.servicios ).subscribe (
			response => {

				if ( response.status ) {
					this.loading = false;
					this.mensaje_update = "Banco modificado con exito.";

				}

				this.actualizado = true;

			},
			error => {

				this.actualizado = true;

				if (error.status == 401) {

					this.mensaje_update = "Su sesion ha expirado, para continuar vuelva a ingresar.";

				}

				if (error.error.mensaje) {
				  this.mensaje_update = error.error.mensaje;
				}

			} 
		);
  
  
	}
	
  
}

