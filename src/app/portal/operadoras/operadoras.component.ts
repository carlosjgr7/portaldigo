import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { OperadorasService } from './operadoras.service';

var element_data: any = [];

@Component({
  selector: 'app-operadoras',
  templateUrl: './operadoras.component.html',
  styleUrls: ['./operadoras.component.scss'],
  providers: [
  	OperadorasService
  ]
})
export class OperadorasComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, private entornoService: EntornoService, private router: Router, private operadorasService: OperadorasService, public dialog: MatDialog) {}


	public operadoras : any;
	public hay_operadora : boolean = false;
	public loading: boolean = false;

	public global_alert = this.entornoService.pivot_msg;

	  ngOnInit() {

			this.entornoService.last_page = this.router.url

			this.entornoService.hideAlert();
		this.loading = true;
	  	this.operadorasService.getOperadoras().subscribe( response => {

	  		this.operadoras = response;
			this.loading = false;
	  		if ( this.operadoras ) {

	  			this.hay_operadora = true;

	  		}

	  	}, error => {

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );
	    
	  }

	  refreshOperadoras ():void {
			this.loading = true;
		  	this.operadorasService.getOperadoras().subscribe( response => {
					this.loading = false;
			  		this.operadoras = response;

			  	

			  	}, error => {
					this.loading = false;
			  		if (error.status == 401) {

						this.entornoService.clearSession();

						this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

						this.router.navigate(['/']);

					}

			} );

	}

	  openDialog( id:number, nombre:string ): void {
		this.loading = true;
	    let dialogRef = this.dialog.open(DeleteOperadoras, {
	      width: '450px',
	      data: { id: id, nombre: nombre }
	    });

	    dialogRef.afterClosed().subscribe(result => {
			this.loading = false;
	      console.log('The dialog was closed');
	      this.refreshOperadoras();
	    });
	  }

}


@Component({
  selector: 'delete-operadoras',
  templateUrl: './detele-operadoras.component.html',
  providers: [
  	OperadorasService, OperadorasComponent
  ]
})
export class DeleteOperadoras {

  constructor(
    public dialogRef: MatDialogRef<DeleteOperadoras>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private palabrasReservadasService: OperadorasService,
    private entornoService: EntornoService, 
    private router: Router,
    private palabrasReservadas : OperadorasComponent,
    private ref: ChangeDetectorRef) { }

  public mensaje_delete : string;

  public borrado : boolean = false;

  onNoClick(): void { 
    this.dialogRef.close();

    var slf = this;
	//slf.palabrasReservadas.refreshPalabrasReservadas();

  }


  borrar ( id:number, nombre:string ) : void {

  	this.palabrasReservadasService.borrarOperadoras( id ).subscribe (
		response => {

			if ( response.status ) {

				this.borrado = true;

  				this.mensaje_delete = "Operadora: " + nombre + " ha sido eliminada con exito.";

  				this.entornoService.pivot_msg.act = false;

			}

		},
		error => {

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

