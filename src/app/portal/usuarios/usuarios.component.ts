import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { UsuariosService } from './usuarios.service';
import { DEFAULT_BREAKPOINTS } from '@angular/flex-layout';

var element_data: any = [];

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [
  	UsuariosService
  ]
})
export class UsuariosComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, 
		private entornoService: EntornoService, 
		private router: Router, 
		private service: UsuariosService, 
		public dialog: MatDialog) {}

	public global_alert = this.entornoService.pivot_msg;

	public usuarios : any = [];

	public filtro : string;

	public loading = false;

	public n_usuarios : number = 0;
	public ultimo_id : number;

	  ngOnInit() {

		this.entornoService.last_page = this.router.url

		this.loading = true;

	  	this.service.getUsuarios().subscribe( response => {
			
			let res:any = response;
			for ( var i = 0; i < res.length; i ++ ) {
  
				this.usuarios.push( res[i] );

			}
	  		//this.usuarios = response;
			this.n_usuarios =  res.length;
	  		if ( this.usuarios.lenght == 0 ) {
				this.ultimo_id = null;
	  			this.global_alert.act = true;
	  			this.global_alert.type = "alert-danger";
				  this.global_alert.mensaje = "No existen usuarios registrados.";
				  
				  this.entornoService.hideAlert();

				  this.loading = false;

	  		} else {

				this.loading = false;
				let temp = res.pop();
	
				this.ultimo_id = null;
				this.ultimo_id = temp.id;

	  			//this.global_alert.act = false;

	  		}

		  }, error => {} );
		  
		  

	  }

	  verMas () {
		this.loading = true;
	  	this.service.getUsuarios(null,this.ultimo_id.toString()).subscribe( response => {

	  		let res: any = response;

	  		this.n_usuarios = res.length

	  		for ( var i = 0; i < res.length; i ++ ) {

	  			this.usuarios.push( res[i] );

	  		}

			  let temp = res.pop();
		

	  		this.ultimo_id = null;

			this.ultimo_id = temp.id;
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

	  buscar ( filtro:string ) {

		this.loading = true;

		this.usuarios = [];


	  	this.service.getUsuarios( filtro, null ).subscribe( response => {

			

			let res: any = response;

			this.n_usuarios = res.length

			for ( var i = 0; i < res.length; i ++ ) {

				this.usuarios.push( res[i] );

			}
			let temp = res.pop();
		

			this.ultimo_id = null;

		 	this.ultimo_id = temp.id;

	  		if ( ! this.usuarios[0] ) {

	  			this.global_alert.act = true;
	  			this.global_alert.type = "alert-danger";
				this.global_alert.mensaje = "No existen usuarios registrados con los criterios de busqueda especificados.";
				  
				this.entornoService.hideAlert();

			  }
			  
			  this.loading = false;

		  }, error => {} );
		  
		  

	  }

	  refreshUsuarios ():void {

		let ultimo:string = null;	
		if(this.ultimo_id != null){
			ultimo =this.ultimo_id.toString();
		}
	  	this.service.getUsuarios(null, ultimo).subscribe( response => {

			this.loading = true;

	  		
			let res: any = response;
			

			this.n_usuarios = res.length;

			

			if(ultimo == null){
				this.n_usuarios = res.length;
				this.usuarios = [];
			}
			for ( var i = 0; i < res.length; i ++ ) {

				this.usuarios.push( res[i] );

			}
		
	  		if ( this.usuarios.lenght == 0 ) {
				this.ultimo_id = null;
	  			this.global_alert.act = true;
	  			this.global_alert.type = "alert-danger";
				  this.global_alert.mensaje = "No existen usuarios registrados.";
				  
				  this.entornoService.hideAlert();

				  this.loading = false;

	  		} else {
				if(res.lenght > 0){
					let temp = res.pop();
		

					this.ultimo_id = null;
		
					this.ultimo_id = temp.id;	
				}
					  
				  this.loading = false;

	  		}

		  }, error => {} );
		  
		  this.loading = false;
	  }



	  openDialog( id:number, usuario:string ): void {

		if(id == this.ultimo_id){
			this.ultimo_id = this.ultimo_id - 1;
		}
	    let dialogRef = this.dialog.open(DeleteUsuarios, {
	      width: '450px',
	      data: { id: id, usuario: usuario }
	    });

	    dialogRef.afterClosed().subscribe(result => {
	
			if(result.respuesta == true){
				for ( var i = 0; i < this.usuarios.length; i ++ ) {
					if ( this.usuarios[i].id == id) {
					
						this.usuarios.splice(i, 1);
						 }
	
				}
				this.refreshUsuarios();
			}
	    	
	      console.log('The dialog was closed');
	    });
	  }

}


@Component({
  selector: 'delete-usuarios',
  templateUrl: './delete-usuarios.component.html',
  providers: [
  	UsuariosService
  ]
})
export class DeleteUsuarios {

  constructor(
    public dialogRef: MatDialogRef<DeleteUsuarios>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: UsuariosService,
    private entornoService: EntornoService, 
    private router: Router,
    private ref: ChangeDetectorRef) { }

  public mensaje_delete : string;

  public borrado : boolean = false;
  public loading: boolean = false;
  public respuestaOk: boolean = false;

  onNoClick(): void {this.dialogRef.close({respuesta:this.respuestaOk});}

  borrar ( id:number, usuario:string ) : void {
	this.loading =true;
	
  	this.service.borrar(id).subscribe( response => {

  		if ( response.status ) {
				this.respuestaOk = true;
				this.borrado = true;

  				this.mensaje_delete = "Usuario: " + usuario + " ha sido eliminado con exito.";

  				this.entornoService.pivot_msg.act = false;

			}
			this.loading =false;

  	}, error => {
		this.borrado = true;
		this.respuestaOk = false;

		this.loading =false;


		if (error.error.mensaje) {
			this.mensaje_delete = error.error.mensaje;
		}
	  } );

  }

}

