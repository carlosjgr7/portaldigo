import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../../entorno/entorno.service';

import { LogTransporteService } from './log-transporte.service';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import {FormControl} from '@angular/forms';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { ExcelService } from '../../../excel/excel.service';
@Component({
  selector: 'app-log-transporte',
  templateUrl: './log-transporte.component.html',
  styleUrls: ['./log-transporte.component.css'],
  providers: [
	  LogTransporteService,
	  ExcelService,
	  	{provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class LogTransporteComponent implements OnInit {

  
	constructor(private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: LogTransporteService,
		private excelService: ExcelService,
		private adapter: DateAdapter<any>) {

  
    }



	public global_alert = this.entorno.pivot_msg;

	public eventos:any = [];

		public canales : any;
		public acciones : any;

		public fechaMax : string = this.fechaHoy();

		public fechaDesde : string;
		public fechaHasta : string;
		public usuario : string = null;
		public canal : string = null;
		public accion : string = null;
		public buscaron: boolean = false;

		public n_eventos : number = 0;
		public ultimo_id : number;

		public loading = true;

		public export : any = [];

		public tarifa:any;


	convertFecha (str) {
	    var date = new Date(str),
	        mnth = ("0" + (date.getMonth()+1)).slice(-2),
	        day  = ("0" + (date.getDate())).slice(-2);
	    return [ date.getFullYear(), mnth, day ].join("-");
	}

	fechaHoy () : string {

		var today : any = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd = '0'+dd
		} 

		if(mm<10) {
		    mm = '0'+mm
		} 

		today = yyyy + '-' + mm + '-' + dd;

		return today;
	}

	excel () {

		this.loading = true;

		this.service.getEventos(this.convertFecha (this.fechaDesde), this.convertFecha (this.fechaHasta), this.usuario, this.canal, this.accion, null, true).subscribe( response => {

			this.export = response;

			for (var i = 0; i < this.export.length; i++) {
				let aux = this.export[i].accion.descripcion;
				let aux2 = this.export[i].canal.nombre;
				let aux3 = this.export[i].usuario.usuario;
				this.export[i].accion = aux;
				this.export[i].canal = aux2;
				this.export[i].usuario = aux3;
			}
			this.loading = false;

            this.excelService.exportAsExcelFile(this.export,null, 'log_transporte');
			
			

		}, error => {
			console.log(error);
			this.loading = false;
		});

		

		/*setTimeout(()=>{ */   //<<<---    using ()=> syntax
		
        /*}, 3000);*/

		//this.excelService.exportAsExcelFile(this.export, 'eventos');

	}

	  ngOnInit() {

		this.adapter.setLocale('es'); //Datepicker spa

		this.entorno.hideAlert(); //hide alert another component or same

		//Acciones
  
		this.service.getAcciones().subscribe( response => {

			this.acciones = response;

		} );

		//Canales

		this.service.getCanales().subscribe( response => {

			this.canales = response;

		  } );
		  
		  //Si existen parametros para el componente en el entorno.
		if ( this.entorno.last_page == this.router.url ) { //la misma pagina

			if ( this.entorno.parametros["fechaDesde"] ) {

				this.fechaDesde = this.entorno.parametros["fechaDesde"];
				this.fechaHasta = this.entorno.parametros["fechaHasta"];
				this.usuario = this.entorno.parametros["usuario"];
				this.canal = this.entorno.parametros["canal"];
				this.accion = this.entorno.parametros["accion"];
				this.ultimo_id = this.entorno.parametros["ultimo_id"];

				this.buscar();

			}
		} else {

			this.entorno.last_page = this.router.url;

			//Si no, busqueda por defecto

			this.service.getEventos(this.fechaHoy(), this.fechaHoy()).subscribe( response => {
				//

				let res: any = response;
				this.n_eventos = res.length;
  
				for ( var i = 0; i < res.length; i ++ ) {
  
					this.eventos.push( res[i] );
  
				}
  
				if ( this.eventos.length > 0 ) {
					this.loading = false;
					this.n_eventos = this.eventos.length;
					
					let temp = res.pop();
	
					this.ultimo_id = null;
					for(let i = 0; i< this.n_eventos; i++)
					{
					
						if(this.eventos[i]!=undefined && this.eventos[i].tarifa == undefined)
						{
							this.eventos[i].tarifa = 'NO APLICA'
						}
						else
						{
							this.eventos[i].tarifa = this.entorno.pipeDecimalBigNumber(this.eventos[i].tarifa)
						}
					}
				  
				  this.ultimo_id = temp.id;
				} else {
				  this.entorno.pivot_msg.act = true;
	
				  this.entorno.pivot_msg.type = 'danger';
	
				  this.entorno.pivot_msg.act = "No existen eventos el dia de hoy.";
				  this.entorno.hideAlert();
				}
	
				this.loading = false;
	
			}, error => {
	
				if (error.status == 401) {
	
				  this.entorno.clearSession();
	
				  this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
	
				  this.router.navigate(['/']);
	
			  }
	
			  this.loading = false;
	
			  } );

		}

	  }

	  verMas () {
		this.loading = true;
	  	this.service.getEventos(this.convertFecha (this.fechaDesde), this.convertFecha (this.fechaHasta), this.usuario, this.canal, this.accion, this.ultimo_id).subscribe( response => {

	  		let res: any = response;

	  		this.n_eventos = res.length

	  		for ( var i = 0; i < res.length; i ++ ) {

	  			this.eventos.push( res[i] );

	  		}

			  let temp = res.pop();
		

	  		this.ultimo_id = null;

			this.ultimo_id = temp.id;
			this.loading = false;


	  	}, error => {
			this.loading = false;

	  		if (error.status == 401) {

				this.entorno.clearSession();

				this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );

	  }

	  buscar () {

		//this.entorno.parametros.push( this.convertFecha (this.fechaDesde), this.convertFecha (this.fechaHasta), this.usuario, this.canal, this.accion, this.ultimo_id );
		if(this.usuario != null){
			this.usuario = this.entorno.limpiarCampo(this.usuario.toString(),"texto");

		}

		if(this.usuario != null && this.usuario.trim().length == 0){
			this.usuario = null;
		}
		this.eventos = null;

		this.loading = true;

	  	this.ultimo_id = null;

		this.buscaron = false;
		  
		  if (this.fechaDesde == null || this.fechaDesde == "") {
     		 this.loading = false;
			this.entorno.pivot_msg.act = true;

				this.entorno.pivot_msg.type = 'alert-danger';

				this.entorno.pivot_msg.mensaje = "Debe seleccionar la fecha desde.";
				this.entorno.hideAlert();

		  } else if (this.fechaHasta == null || this.fechaHasta == "") {
       		 this.loading = false;
			this.entorno.pivot_msg.act = true;

				this.entorno.pivot_msg.type = 'alert-danger';

				this.entorno.pivot_msg.mensaje = "Debe seleccionar la fecha hasta.";
				this.entorno.hideAlert();

		  } else {

		  

	  	this.service.getEventos(this.convertFecha (this.fechaDesde), this.convertFecha (this.fechaHasta), this.usuario, this.canal, this.accion, this.ultimo_id).subscribe( response => {
			this.eventos = [];
			let res: any = response;
						
			for ( var i = 0; i < res.length; i ++ ) {

				this.eventos.push( res[i] );

			}
					
	  		if ( this.eventos.length != 0 ) {

				this.buscaron = true;

				this.n_eventos = this.eventos.length;

				  let temp = res.pop();
				  
				

		  		this.ultimo_id = null;

				this.ultimo_id = temp.id;

				this.entorno.parametros["fechaDesde"] = this.fechaDesde;
				this.entorno.parametros["fechaHasta"] = this.fechaHasta;
				this.entorno.parametros["usuario"] = this.usuario;
				this.entorno.parametros["canal"] = this.canal;
				this.entorno.parametros["accion"] = this.accion;
				this.entorno.parametros["ultimo_id"] = this.ultimo_id;

				
	  		} else {
				this.buscaron = false;

				this.entorno.pivot_msg.act = true;

				this.entorno.pivot_msg.type = 'alert-danger';

				this.entorno.pivot_msg.mensaje = "No existen eventos asociados a su criterio de busqueda.";
				this.entorno.hideAlert();
				
			}

			  this.loading = false;

	  	}, error => {

	  		if (error.status == 401) {

				this.entorno.clearSession();

				this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}else{
				this.entorno.pivot_msg.act = true;

				this.entorno.pivot_msg.type = 'alert-danger';

				this.entorno.pivot_msg.mensaje = "No existen eventos asociados a su criterio de busqueda.";
				this.entorno.hideAlert();
			}

			this.loading = false;

	    } );
    }

	  }

	  // this is for the start date
    startDate = new Date(1990, 0, 1);

    // Datepicker selected value
    date = new FormControl(new Date());
    //serializedDate = new FormControl((new Date()).toLocaleDateString());

    // Datepicker input and change event

    events: string[] = [];

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.events.push(`${type}: ${event.value}`);
    }

}
