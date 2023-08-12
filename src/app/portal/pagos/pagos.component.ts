import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import {FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

import { EntornoService } from '../../entorno/entorno.service';

import { PagosService } from './pagos.service';


import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { ExcelService } from '../../excel/excel.service';
import BigNumber from "bignumber.js";


@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  providers: [
	  PagosService,
	  ExcelService,
	  {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
	  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
	  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class PagosComponent implements OnInit { 

	constructor(
		private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: PagosService,
		private excelService: ExcelService,
		private adapter: DateAdapter<any>,
		private datePipe: DatePipe
	) {}

	public global_alert = this.entorno.pivot_msg;

	public bancos : any;
	public fechaDesde : string;
	public fechaHasta : string;
	public banco : number;
	public telefono : string;
	public identificacion :string;

	public pagos: any;
	public pagos_exportar : any;
	public n_pagos: any;
	public pagosRecibidos: any;
	public ultimo_id : any;

	public n_pagosRecibidos : number;

	public loading = false;

	public fechaMax : string = this.fechaHoy();

	onSequenceChangeEvent(){
		if(this.telefono != null){
			this.telefono = this.entorno.limpiarCampo(this.telefono.toString(),"numeros");

		}
		if(this.identificacion != null){
			this.identificacion = this.entorno.limpiarCampo(this.identificacion.toString(),"texto");

		}
	}
	excel( tipo: number ) {

		var obj : any = [];
		let tipoConsulta = tipo == 1 ? 'D' : 'C';
		let nombreArchivo = tipo == 1 ? 'pagos-emitidos' : 'pagos-recibidos';
		this.loading=true;
		this.service.getPagos(
			tipoConsulta, 
			this.datePipe.transform(this.fechaDesde, 'yyyy-MM-dd'), 
			this.datePipe.transform(this.fechaHasta, 'yyyy-MM-dd'), 
			this.banco,
			this.telefono,
			this.identificacion,
			null,
			true
			).subscribe( response => {
				
				this.pagos_exportar = response;
				//Nombre de pestaña del excel
				let sheets = ["data"];

				//Lista de nombres de cada columna
				 let cabecera = ["Id", "Referencia", "Emisor", "Receptor", "Canal", "Codigo Switch", "Concepto de Pago","Estatus","Fecha de Pago",
				"Fecha de Solicitud","Identificación Emisor", "Identificación Receptor", "Moneda", "Monto", "Comisión", "Neto", "Descripción",
				"Teléfono Emisor","Telefono Receptor"];
				//Nombre del archivo con su extensión
				let nombreExcel = nombreArchivo + + new Date().getTime() + ".xlsx" ;

				//Creación de lista de objeto genérico
                    this.pagos_exportar.forEach( pago => {
                        obj.push({
                            "Id" : pago.id,
                            "Referencia" :  pago.anulacion && pago.infoAnulacion ? pago.infoAnulacion.referenciaReverso : pago.referencia,
                            "Emisor" : pago.bancoEmisor.nombreCorto,
                            "Receptor" : pago.bancoReceptor.nombreCorto,
                            "Canal" : pago.canal.nombre,
                            "Codigo switch" : pago.codigoSwitch,
                            "Concepto de pago" : pago.concepto,
                            "Estatus" : pago.estatus,
                            "Fecha de pago" : pago.fechaPago,
                            "Fecha de solicitud" : pago.fechaSolicitud,
                            "Identificacion emisor" : pago.anulacion && pago.infoAnulacion ? pago.identificacionReceptor : pago.identificacionEmisor,
                            "Identificacion receptor" : pago.anulacion && pago.infoAnulacion ? pago.identificacionEmisor : pago.identificacionReceptor,
                            "Moneda" : pago.moneda,
                            "Monto" : this.entorno.limpiarMonto(pago.monto),
                             "Comisión" : this.entorno.limpiarMonto(pago.porcomision),
                            "Neto": this.entorno.limpiarMonto(pago.neto),
                            "Descripción": pago.descTransaccion,
                            "Telefono emisor" : pago.anulacion && pago.infoAnulacion ? pago.telefonoReceptor: pago.telefonoEmisor,
                             "Telefono receptor" : pago.anulacion && pago.infoAnulacion ? pago.telefonoEmisor : pago.telefonoReceptor,
                             "Sucursal" : pago.sucursal && pago.sucursal.nombre ? pago.sucursal.nombre + (pago.sucursal.eliminado ? '(E)' : ''): '',
                             "Caja" : pago.sucursal && pago.sucursal.caja ? pago.sucursal.caja.codigo + (pago.sucursal.caja.eliminado ? '(E)' : '') : '',
                             "Usuario" : pago.sucursal && pago.sucursal.infoUsuario ? pago.sucursal.infoUsuario.usuario : ""
                        });
                    });
             
                 
				 // Lista para indicar qué campos son para tratar como montos

				 let montos = ["15","16","17"];
				
				 //tipoPago: string, usuario: string, pagos:any[], cabecera:any[], nombreArchivo: string, origen: string, sheets:any[]
				/*	this.service.crearExcelApi(tipo.toString(), this.entorno.usuario, obj,nombreExcel,"PAGOS_ADMIN",sheets)
				.subscribe( response => {

				})*/
				
				this.excelService.exportAsExcelFile(obj,null, nombreArchivo);
				this.loading=false;

			}
		)
		
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

	formatearMonto(lista, proiedad){
		for (let i = 0; i < lista.length; i++){
			lista[i][proiedad] = this.entorno.pipeDecimalBigNumber(lista[i][proiedad].toString());
		  }
		  return lista;
	}

	ngOnInit() {

		this.loading = true;
		this.adapter.setLocale('es'); //datepicker spa

		this.entorno.hideAlert(); //hide aler another or same component

		//Bancos
	  	this.service.getBancos().subscribe( response => {

	  		this.bancos = response;

		} );

		if ( this.entorno.last_page == this.router.url ) {
			
			if ( this.entorno.parametros["fechaDesde"] ) {

				this.fechaDesde = this.entorno.parametros["fechaDesde"];
				this.fechaHasta = this.entorno.parametros["fechaHasta"];
				this.banco = this.entorno.parametros["banco"];
				this.telefono = this.entorno.parametros["telefono"];
				this.identificacion = this.entorno.parametros["identificacion"];

				this.buscar("D", this.ultimo_id);
				this.buscar("C", this.ultimo_id);

			}

		} else {

			this.fechaDesde = this.fechaHoy();
			this.fechaHasta = this.fechaHoy();
	
			this.service.getPagos("D",this.fechaHoy(), this.fechaHoy()).subscribe( response => {

					this.pagos = this.formatearMonto(response,"monto");
				
					this.n_pagos = this.pagos.length;
	
					if (this.pagos.length == 0) {
						this.loading = false;

						this.entorno.pivot_msg.act = true;
	
						this.entorno.pivot_msg.type = "alert-danger";
	
						this.entorno.pivot_msg.mensaje ="No se han emitido pagos el dia de hoy.";

	
					} else if ( this.pagos.length == 1 ) {
						this.loading = false;

						this.entorno.pivot_msg.act = false;
	
					} else {

						// antes se hacia pop, no se porque
						let temp = this.pagos[this.n_pagos-1];

					
						this.ultimo_id = temp.id;
	
					
						this.entorno.pivot_msg.act = false;
						this.loading = false;

					}
			}, error => {
				if (error.status == 401) {
					this.loading = false;
					this.entorno.clearSession();
	
					this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
	
					this.router.navigate(['/']);
	
				}
			});
	
			this.service.getPagos("C",this.fechaHoy(), this.fechaHoy()).subscribe( response => {
				this.pagosRecibidos =this.formatearMonto(response,"monto");
	
	
					this.n_pagosRecibidos = this.pagosRecibidos.length;
	
					if (this.pagosRecibidos.length == 0) {
						this.loading = false;

	
						this.entorno.pivot_msg.act = true;
	
						this.entorno.pivot_msg.type = "alert-danger";
	
						this.entorno.pivot_msg.mensaje ="No se han recibido pagos el dia de hoy.";
	
					} else if ( this.pagosRecibidos.length == 1 ) {
						this.loading = false;

	
						this.entorno.pivot_msg.act = false;
	
					} else {

						// antes se hacia pop, no se porque
						let temp = this.pagosRecibidos[this.n_pagosRecibidos-1];

						this.ultimo_id = temp.id;
	
						this.entorno.pivot_msg.act = false;
						this.loading = false;


					}
			}, error => {
				if (error.status == 401) {
					this.loading = false;

					this.entorno.clearSession();
	
					this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
	
					this.router.navigate(['/']);
	
				}
			});

			this.entorno.last_page = this.router.url;

		}
		  
	}

	verMas ( tipo:string, last_id:number ) {
		this.loading = true;
		this.service.getPagos(tipo, 
		this.datePipe.transform(this.fechaDesde, 'yyyy-MM-dd'), 
		this.datePipe.transform(this.fechaHasta, 'yyyy-MM-dd'),	
		this.banco,
		this.telefono,
		this.identificacion,
		last_id ).subscribe( response => {
			let res:any = response;
			this.n_pagos = res.length;

			if ( tipo == "D" ) {

 				res = this.formatearMonto(res,"monto");
				 for ( var i = 0; i < res.length; i ++ ) {

					this.pagos.push( res[i] );
  
				}


				if (this.pagos.length == 0) {

					this.entorno.pivot_msg.act = true;

					this.entorno.pivot_msg.type = "alert-danger";

					this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";

				} else {

					let temp = res.pop();

					this.ultimo_id = temp.id;


					this.entorno.pivot_msg.act = false;


				}

			} else {

				this.pagosRecibidos = this.formatearMonto(response,"monto");


				this.n_pagos = this.pagosRecibidos.length;

				if (this.pagosRecibidos.length == 0) {

					this.entorno.pivot_msg.act = true;

					this.entorno.pivot_msg.type = "alert-danger";

					this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";

				} else {

					let temp = this.pagosRecibidos.pop();

					this.ultimo_id = temp.id;


					this.entorno.pivot_msg.act = false;


				}

			}
			this.loading = false;

		} );
	}

	buscar ( tipo:string, last_id:number ) : any {
		this.loading = true;
		if(this.telefono != null){
			this.telefono = this.entorno.limpiarCampo(this.telefono.toString(),"numeros");

		}
		if(this.identificacion != null){
			this.identificacion = this.entorno.limpiarCampo(this.identificacion.toString(),"texto");
		}
		if ( this.fechaDesde == null || this.fechaDesde == "" ) {
			this.loading = false;

			this.entorno.pivot_msg.act = true;

					this.entorno.pivot_msg.type = "alert-danger";

					this.entorno.pivot_msg.mensaje ="Debe seleccionar la fecha desde.";

					this.entorno.hideAlert();

		} else if ( this.fechaHasta == null || this.fechaHasta == "" ) {
			this.loading = false;

			this.entorno.pivot_msg.act = true;

					this.entorno.pivot_msg.type = "alert-danger";

					this.entorno.pivot_msg.mensaje ="Debe seleccionar la fecha hasta.";

					this.entorno.hideAlert();

		} else {

			this.loading = true;
		
		
		this.service.getPagos(tipo, 
					this.datePipe.transform(this.fechaDesde, 'yyyy-MM-dd'), 
					this.datePipe.transform(this.fechaHasta, 'yyyy-MM-dd'), 
					this.banco,
					this.telefono,
					this.identificacion,
					last_id ).subscribe( response => {

			if ( tipo == "D" ) {

 				this.pagos = this.formatearMonto(response,"monto");


				if (this.pagos.length == 0) {
					this.loading = false;

					this.entorno.pivot_msg.act = true;

					this.entorno.pivot_msg.type = "alert-danger";

					this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";

					this.entorno.hideAlert();

				} else {
					
					this.n_pagos = this.pagos.length;

					let temp = this.pagos[this.n_pagos-1];

					this.ultimo_id = temp.id;


					this.entorno.pivot_msg.act = false;
					this.loading = false;

				}

			} else {

				this.pagosRecibidos = this.formatearMonto(response,"monto");



				if (this.pagosRecibidos.length == 0) {
					this.loading = false;
					this.entorno.pivot_msg.act = true;

					this.entorno.pivot_msg.type = "alert-danger";

					this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";

					this.entorno.hideAlert();

				} else {

					this.n_pagosRecibidos = this.pagosRecibidos.length;

					let temp = this.pagosRecibidos[this.n_pagosRecibidos-1];

					this.ultimo_id = temp.id;

					this.entorno.pivot_msg.act = false;
					this.loading = false;

				}

			}

			this.entorno.parametros["fechaDesde"] = this.fechaDesde;
			this.entorno.parametros["fechaHasta"] = this.fechaHasta;
			this.entorno.parametros["banco"] = this.banco;
			this.entorno.parametros["telefono"] = this.telefono;
			this.entorno.parametros["identificacion"] = this.identificacion;

			this.loading = false;

		}, error => {
			if (error.status == 401) {
				this.loading = false;
				this.entorno.clearSession();

				this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}
		} );

		}

	}

	  // this is for the start date
    startDate = new Date(1990, 0, 1);

    // Datepicker selected value
    date = new FormControl(new Date());
    serializedDate = new FormControl((new Date()).toISOString());

    // Datepicker input and change event

    events: string[] = [];

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.events.push(`${type}: ${event.value}`);
    }

}