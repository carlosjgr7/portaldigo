import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { BancosService } from './bancos.service';

var element_data: any = [];

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss'],
  providers: [
  	BancosService
  ]
})
export class BancosComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, 
		private entornoService: EntornoService, 
		private router: Router, 
		private bancosService: BancosService, 
		public dialog: MatDialog) {}


	public bancos : any;
	public hay_bancos : boolean = false;
	public bancos_temporal : any;
	public loading: boolean =true;
	public global_alert = this.entornoService.pivot_msg;

	  ngOnInit() {

			this.entornoService.last_page = this.router.url

			this.entornoService.hideAlert();

	  	this.bancosService.getBancos().subscribe( response => {

	  		this.bancos_temporal = response;
						
						this.bancos = response;

	  		if ( this.bancos ) {

	  			this.hay_bancos = true;
				this.loading = false;
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

	  refreshBancos ():void {
		this.loading = true;
		  	this.bancosService.getBancos().subscribe( response => {

						this.bancos_temporal = response;
						
						this.bancos = response;
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

	applyFilter(filterValue: string) {


    var results = new Array();
    for(let index=0; index < this.bancos_temporal.length; index++ ){

      let nombreCorto : string = this.bancos_temporal[index].nombreCorto;
      let codigo : string = this.bancos_temporal[index].codigo;


      if ( nombreCorto.toLowerCase().search(filterValue.toLowerCase()) != -1 ||
					codigo.toLowerCase().search(filterValue.toLowerCase()) != -1) {

        results.push(this.bancos_temporal[index]);

      }

		}
		
		this.bancos = results;
  }

	  openDialog( id:number, banco:string, codigo:string ): void {
	    let dialogRef = this.dialog.open(DeleteBancos, {
	      width: '450px',
	      data: { id: id, banco: banco, codigo:codigo }
	    });

	    dialogRef.afterClosed().subscribe(result => {
	      console.log('The dialog was closed');
	      this.refreshBancos();
	    });
	  }

}


@Component({
  selector: 'delete-bancos',
  templateUrl: './delete-bancos.component.html',
  providers: [
  	BancosService, BancosComponent
  ]
})
export class DeleteBancos {

  constructor(
    public dialogRef: MatDialogRef<DeleteBancos>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bancosService: BancosService,
    private entornoService: EntornoService, 
    private router: Router,
    private bancos : BancosComponent,
    private ref: ChangeDetectorRef) { }

  public mensaje_delete : string;

  public borrado : boolean = false;

  onNoClick(): void { 
    this.dialogRef.close();

    var slf = this;
	//slf.palabrasReservadas.refreshPalabrasReservadas();

  }


  borrar ( id:number, banco:string ) : void {

  	this.bancosService.borrarBancos( id ).subscribe (
		response => {

			if ( response.status ) {

				this.borrado = true;

  				this.mensaje_delete = "Banco: " + banco + " ha sido eliminado con exito.";

  				this.entornoService.pivot_msg.act = false;

			}

		},
		error => {

			this.borrado = true;

			if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

			if (error.error.mensaje) {
				this.mensaje_delete = error.error.mensaje;
			}

		} 
	);
  }

}

