import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../../entorno/entorno.service';

import { ActualizarParametrosService } from './actualizar.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import BigNumber from "bignumber.js";

@Component({
  selector: 'app-parametros-actualizar',
  templateUrl: './actualizar.component.html',
  providers: [
  	ActualizarParametrosService
  ]
})

export class ActualizarParametrosTransporteComponent implements OnInit {
	public loading:boolean = false;
	constructor(private ref: ChangeDetectorRef, 
		public entornoService: EntornoService,
		private router: Router, 
		private actualizar: ActualizarParametrosService,
		private route: ActivatedRoute,
		public dialog: MatDialog) {}

	public global_alert = this.entornoService.pivot_msg;

	public parametros : any = {
		valor : ""
	}
	public tarifas:any;

	private id : any = this.route.snapshot.params['id'];

	public mensaje : string;

	public actualizado : boolean = false;

	ngOnInit() {
	    this.loading= true;
		this.actualizar.getParametro(this.id).subscribe( response => {

	  		this.parametros = response;
			if(this.parametros.clave =="tarifa"){
				this.entornoService.esCampoTarifa = true;
				this.parametros.valor = this.entornoService.pipeDecimalBigNumber(this.parametros.valor);
				this.actualizar.getUltimasTarifas()
				.finally( () =>{
		
					for (let i = 0; i < this.tarifas.length ; i++){
						
						if(this.tarifas[i].tarifa!=null){
							this.tarifas[i].tarifa= this.entornoService.pipeDecimalBigNumber(this.tarifas[i].tarifa.toString());
						}
						}
						this.loading = false
		
				 } )
				.subscribe( response => {
					this.tarifas = response
		
				
	  
				}, error => {
				  this.loading= false;
				  if (error.status == 401) {

					this.entornoService.clearSession();
	
					this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
	
					this.router.navigate(['/']);
	
				} else {
					this.entornoService.pivot_msg.act = true;
	
					this.entornoService.pivot_msg.type = "alert-danger";
	
					this.entornoService.pivot_msg.mensaje = "Ha ocurrido un error interno por favor intente mas tarde.";
	
	
					this.router.navigate(['/portal/transporte/parametros-transporte']);
				}
	  
			  } );

			}else{
				this.entornoService.esCampoTarifa = false;
			}
			this.loading= false;

	  	}, error => {
			this.loading= false;

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			} else {
				this.entornoService.pivot_msg.act = true;

				this.entornoService.pivot_msg.type = "alert-danger";

				this.entornoService.pivot_msg.mensaje = "Ha ocurrido un error interno por favor intente mas tarde.";


				this.router.navigate(['/portal/transporte/parametros-transporte']);
			}

	    } );

	}

	limpiar(){
		let values = this.parametros.valor;
		let monto = values.monto;
		if(monto == " "){
				monto = this.entornoService.limpiarCampo(monto.toString(),"numeros");
				this.parametros.valor = monto;
		  return this.parametros.valor;
	
		}
	}
	openDialog () 
	{
		
		if(this.parametros.valor != null){
			this.parametros.valor = this.entornoService.limpiarCampo(this.parametros.valor.toString(),"filtro");
	
			}
		let isnumber = new BigNumber(this.parametros.valor.toString());
		if (!isnumber.isZero() && (this.parametros.valor == '' || this.parametros.valor.trim() == 0)) {

			this.mensaje = "Debe escribir un valor";
		/*} else if ( isnumber.isInteger()
		&&  new BigNumber("0").isGreaterThanOrEqualTo(new BigNumber(this.entornoService.limpiarMonto(this.parametros.valor).toString()))) {

			this.mensaje = "El valor debe ser mayor a 0";

		*/
		}else if ( this.parametros.valor!=null && 
			(this.parametros.valor.substring(0,1)==" " ||  this.parametros.valor.substring( this.parametros.valor.length-1, this.parametros.valor.length)==" ")){
			  this.mensaje ="El valor del parámetro no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
		  	} else {
				if(this.entornoService.esCampoTarifa == true){
					this.parametros.valor = this.entornoService.limpiarMonto(this.parametros.valor)
				}
				console.log("nuevo valor de parametro =>",this.parametros.valor)
				let dialogRef = this.dialog.open(UpdateParametroTransporteComponent, {
					width: '450px',
					data: { id: this.id, parametros: this.parametros }
				});
			  
				  dialogRef.afterClosed().subscribe(result => {
					console.log('The dialog was closed');
					this.router.navigate(['/portal/transporte/parametros-transporte']);
				  });

		}

	}

	update () {
		this.loading = true;
		let isnumber = new BigNumber(this.parametros.valor.toString());
		if (!isnumber.isZero() && (this.parametros.valor == '' || this.parametros.valor.trim() == 0)) {

			this.mensaje = "Debe escribir un valor";

		}else {

			this.actualizar.actualizarParametro( this.id, this.parametros.valor ).subscribe (
					response => {

						if ( response.status ) {

							this.actualizado = true;

							this.entornoService.pivot_msg.act = true;

							this.entornoService.pivot_msg.type = "alert-success";

							this.entornoService.pivot_msg.mensaje = "El valor de " + this.parametros.descripcion + " ha sido modificado con exito.";


							this.router.navigate(['/portal/transporte/parametros-transporte']);
							this.loading = false;

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

@Component({
	selector: 'update-parametro',
	templateUrl: './update-parametro-transporte.component.html',
	providers: [
		ActualizarParametrosService
	]
  })
  export class UpdateParametroTransporteComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdateParametroTransporteComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  public entornoService: EntornoService,
	  private service: ActualizarParametrosService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
	public loading:boolean = false;
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( id:number, parametros: any ) {
		this.loading= true;
		this.service.actualizarParametro( id, parametros.valor ).subscribe (
			response => {

				if ( response.status ) {

					this.actualizado = true;
					this.mensaje_update = "Modificacion exitosa";

				}
				this.loading = false;
			},
			error => {
				this.loading = false;
				this.actualizado = true;

				if (error.status == 401) {
					this.mensaje_update = "su sesion ha expirado.";

				}

				if (error.status == 403) {
					this.mensaje_update = error.error.mensaje;;

				}

				console.log(error);
/*
				if (error.error.mensaje) {
				  this.mensaje_update = error.error.mensaje;
				}*/

			} 
		);
  
	}
	
  
}