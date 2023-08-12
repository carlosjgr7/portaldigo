import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { TiposDeIdentificacionService } from './tipos-de-identificacion.service';

var element_data: any = [];

@Component({
  selector: 'app-tipos-de-identificacion',
  templateUrl: './tipos-de-identificacion.component.html',
  styleUrls: ['./tipos-de-identificacion.component.scss'],
  providers: [
  	TiposDeIdentificacionService
  ]
})
export class TiposDeIdentificacionComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, private entornoService: EntornoService, private router: Router, private tiposIdentificacionService: TiposDeIdentificacionService, public dialog: MatDialog) {}


	public tipos_identificacion : any;
	public hay_palabras : boolean = false;
	public loading : boolean = false;

	public global_alert = this.entornoService.pivot_msg;

	  ngOnInit() {

			this.entornoService.last_page = this.router.url

			this.entornoService.hideAlert();
		this.loading = true
	  	this.tiposIdentificacionService.getTiposDeIdentificacion().subscribe( response => {

	  		this.tipos_identificacion = response;
			this.loading = false;
	  		if ( this.tipos_identificacion ) {

	  			this.hay_palabras = true;

	  		}

	  	}, error => {
			this.loading = false;
	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );
	    
	  }

	  refreshTiposIdentificacion ():void {
			this.loading = true;
		  	this.tiposIdentificacionService.getTiposDeIdentificacion().subscribe( response => {

			  		this.tipos_identificacion = response;
					this.loading = false;

			  	}, error => {
					this.loading = false;
			  		if (error.status == 401) {

						this.entornoService.clearSession();

						this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

						this.router.navigate(['/']);

					}

			} );

	}

	  openDialog( id:number, tipo:string ): void {
	    let dialogRef = this.dialog.open(DeleteTiposDeIdentificacion, {
	      width: '450px',
	      data: { id: id, tipo: tipo }
	    });

	    dialogRef.afterClosed().subscribe(result => {
	      console.log('The dialog was closed');
	      this.refreshTiposIdentificacion();
	    });
	  }

}


@Component({
  selector: 'delete-tipos-de-identificacion',
  templateUrl: './detele-tipos-de-identificacion.component.html',
  providers: [
  	TiposDeIdentificacionService, TiposDeIdentificacionComponent
  ]
})
export class DeleteTiposDeIdentificacion {

  constructor(
    public dialogRef: MatDialogRef<DeleteTiposDeIdentificacion>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tiposIdentificacion: TiposDeIdentificacionService,
    private entornoService: EntornoService, 
    private router: Router,
    private palabrasReservadas : TiposDeIdentificacionComponent,
    private ref: ChangeDetectorRef) { }

  public mensaje_delete : string;

  public borrado : boolean = false;
  public loading : boolean = false;

  onNoClick(): void { 
    this.dialogRef.close();

    var slf = this;
	//slf.palabrasReservadas.refreshPalabrasReservadas();

  }


  borrar ( id:number, tipo:string ) : void {
	this.loading = true;
  	this.tiposIdentificacion.borrarTiposDeIdentificacion( id ).subscribe (
		response => {
			this.loading = false;
			if ( response.status ) {

				this.borrado = true;

  				this.mensaje_delete = "Tipo de identificacion: " + tipo + " ha sido eliminada con exito.";

  				this.entornoService.pivot_msg.act = false;

			}

		},
		error => {
			this.loading = false;
			if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

			this.borrado = true;

			if (error.error.mensaje) {
				this.mensaje_delete = error.error.mensaje;
			}

		} 
	);
  }

}

