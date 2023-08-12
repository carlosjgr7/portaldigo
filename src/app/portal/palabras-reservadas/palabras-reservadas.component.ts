import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { PalabrasReservadasService } from './palabras-reservadas.service';

var element_data: any = [];

@Component({
  selector: 'app-palabras-reservadas',
  templateUrl: './palabras-reservadas1.component.html',
  styleUrls: ['./palabras-reservadas.component.scss'],
  providers: [
  	PalabrasReservadasService
  ]
})
export class PalabrasReservadasComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, private entornoService: EntornoService, private router: Router, private palabrasReservadasService: PalabrasReservadasService, public dialog: MatDialog) {}


	public palabras_reservadas : any;
	public hay_palabras : boolean = false;

	public global_alert = this.entornoService.pivot_msg;

	  ngOnInit() {

			this.entornoService.last_page = this.router.url

			this.entornoService.hideAlert();

	  	this.palabrasReservadasService.getPalabrasReservadas().subscribe( response => {

	  		this.palabras_reservadas = response;

	  		if ( this.palabras_reservadas ) {

	  			this.hay_palabras = true;

	  		}

	  	}, error => {

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );
	    
	  }

	  refreshPalabrasReservadas ():void {

		  	this.palabrasReservadasService.getPalabrasReservadas().subscribe( response => {

			  		this.palabras_reservadas = response;


			  	}, error => {

			  		if (error.status == 401) {

						this.entornoService.clearSession();

						this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

						this.router.navigate(['/']);

					}

			} );

	}

	  openDialog( id:number, palabra:string ): void {
	    let dialogRef = this.dialog.open(DeletePalabrasReservadas, {
	      width: '450px',
	      data: { id: id, palabra: palabra }
	    });

	    dialogRef.afterClosed().subscribe(result => {
	      console.log('The dialog was closed');
	      this.refreshPalabrasReservadas();
	    });
	  }

}


@Component({
  selector: 'delete-palabras-reservadas',
  templateUrl: './detele-palabras-reservadas.component.html',
  providers: [
  	PalabrasReservadasService, PalabrasReservadasComponent
  ]
})
export class DeletePalabrasReservadas {

  constructor(
    public dialogRef: MatDialogRef<DeletePalabrasReservadas>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private palabrasReservadasService: PalabrasReservadasService,
    private entornoService: EntornoService, 
    private router: Router,
    private palabrasReservadas : PalabrasReservadasComponent,
    private ref: ChangeDetectorRef) { }

  public mensaje_delete : string;

  public borrado : boolean = false;

  onNoClick(): void { 
    this.dialogRef.close();

    var slf = this;
	//slf.palabrasReservadas.refreshPalabrasReservadas();

  }


  borrar ( id:number, palabra:string ) : void {

  	this.palabrasReservadasService.borrarPalabrasReservadas( id ).subscribe (
		response => {

			if ( response.status ) {

				this.borrado = true;

  				this.mensaje_delete = "Palabra reservada " + palabra + " ha sido eliminada con exito.";

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

