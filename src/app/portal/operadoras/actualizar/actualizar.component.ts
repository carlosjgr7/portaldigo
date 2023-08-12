import { Component, OnInit, Inject } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { ActualizarOperadorasService } from './actualizar.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var element_data: any = [];

@Component({
  selector: 'app-operadoras-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss'],
  providers: [
  	ActualizarOperadorasService
  ]
})
export class ActualizarOperadorasComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router, private actualizar: ActualizarOperadorasService, private route: ActivatedRoute,public dialog: MatDialog) {}


	public operadora : any  = {
            "codigo": '',
            "nombre" : '',
            "activo" : ''
        };
	public mensaje : string;
	public mensaje_success : string;

	public actualizado : boolean = false;

	public checked : boolean = false;
	public loading : boolean = false;

	private id : any = this.route.snapshot.params['id'];

	  ngOnInit() {

	    this.loading = true;	
	    this.actualizar.getOperadora(this.id).subscribe( response => {

		  	this.operadora = response;
			this.loading = false;
		  	this.checked = this.operadora.activo;

	  	}, error => {
			this.loading = false;
	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			} else {

				this.entornoService.pivot_msg.act = true;

				this.entornoService.pivot_msg.type = "alert-danger";

				this.entornoService.pivot_msg.mensaje = "Ha ocurrido un error interno, por favor intente mas tarde.";


				this.router.navigate(['/portal/catalogo/operadoras']);

			}

	    } );	


	}

	private existeOperadora ( operadora:string ): boolean {
		return false;
	}

	update () {

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

			if ( this.existeOperadora( this.operadora.palabra ) ) {

				this.mensaje = "Esta palabra reservada, ya existe.";

			} else {

				if ( this.checked ) {

					this.operadora.activo = true;

				} else {

					this.operadora.activo = false;

				}
				this.loading = true;
				this.actualizar.actualizarOperadoras( this.id, this.operadora.codigo, this.operadora.nombre, this.operadora.activo ).subscribe (
					response => {
						this.loading = false;
						if ( response.status ) {

							this.mensaje_success = "Operadora modificada con exito.";

							this.mensaje = null;

							this.actualizado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "Operadora " + this.operadora.nombre + " ha sido modificada con exito.";


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
				);

			}

	}

}

	openDialog () {

		if ( this.operadora.codigo == '' ) {

			this.mensaje = "Debe escribir el codigo de la operadora.";

		} else if ( this.operadora.nombre == '' ) {

			this.mensaje = "Debe escribir el nombre de la operadora.";

		} else {

			if ( this.existeOperadora( this.operadora.palabra ) ) {

				this.mensaje = "Esta palabra reservada, ya existe.";

			} else {

				if ( this.checked ) {

					this.operadora.activo = true;

				} else {

					this.operadora.activo = false;

				}

				
				let dialogRef = this.dialog.open(UpdateOperadoraComponent, {
					width: '450px',
					data: { id: this.id, operadora: this.operadora }
				});
			  
				  dialogRef.afterClosed().subscribe(result => {
					console.log('The dialog was closed');
					this.router.navigate(['/portal/catalogo/operadoras']);
				  });



			}	
		}

	}

}

@Component({
	selector: 'update-operadora',
	templateUrl: './update-operadora.component.html',
	providers: [
		ActualizarOperadorasService
	]
  })
  export class UpdateOperadoraComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdateOperadoraComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private entornoService: EntornoService,
	  private service: ActualizarOperadorasService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
	public loading : boolean = false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( id:number, operadora: any ) {
		this.loading = true;
		this.service.actualizarOperadoras( id, operadora.codigo, operadora.nombre, operadora.activo ).subscribe (
			response => {
			this.loading = false;	
				if ( response.status ) {

					this.mensaje_update = "Operadora modificada con exito.";

					this.actualizado = true;

				}

			},
			error => {

				if (error.status == 401) {

					this.mensaje_update = 'Su sesion ha expirado, ingrese nuevamente.';

					this.actualizado = true;

				}

				if (error.error.mensaje) {
					this.mensaje_update = error.error.mensaje;
					this.actualizado = true;
				}

			} 
		);
  
  
	}
	
  
}

