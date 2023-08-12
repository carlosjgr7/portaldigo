import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { DigitelService } from './digitel.service';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import {FormControl} from '@angular/forms';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { ConciliacionService } from '../../conciliacion/conciliacion.service';
import * as moment from 'moment';



@Component({
  selector: 'app-digitel',
  templateUrl: './digitel.component.html',
  styleUrls: ['./digitel.component.scss'],
  providers: [
	  DigitelService,
	  ConciliacionService,
	  {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
	  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
	  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class DigitelComponent implements OnInit {

  constructor(private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: DigitelService,
		private conciliacionService: ConciliacionService,
	private adapter: DateAdapter<any>) {}

	public global_alert = this.entorno.pivot_msg;

	public fechaDesde : string;
	public fechaHasta : string;
	public telefonoEmisor : string;
	public telefonoReceptor : string;
	public concepto :string;
	public referencia :string;

	//public recargas: any;
	//public n_recargas: any;
	public recargasRecibidas: any;
	public pagoDeFacturasRecebidos: any;
	public transacciones_exportar : any;
	public ultimo_id: any;

	public n_recargasRecibidas : number;
	public n_pagoDeFacturasRecebidos : number;

	public loading = false;

	public fechaMax : string = this.fechaHoy();


	convertFecha (str) 
	{
	    var date = new Date(str),
	        mnth = ("0" + (date.getMonth()+1)).slice(-2),
	        day  = ("0" + (date.getDate())).slice(-2);
	    return [ date.getFullYear(), mnth, day ].join("-");
	}

	conciliacion( tipoTransaccion: string )
	{
		this.loading = true;
		if(this.fechaDesde != null && this.fechaHasta != null && (this.n_recargasRecibidas > 0 || this.n_pagoDeFacturasRecebidos > 0))
		{
			var dateFrom = new Date(this.fechaDesde);
			var dateUntil = new Date(this.fechaHasta);
			var differenceInTime = dateFrom.getTime() - dateUntil.getTime();
			var differenceInDays = differenceInTime / (1000 * 3600 * 24);
			if (differenceInDays != 0)
			{
				this.loading = false;
				this.entorno.pivot_msg.act = true;
				this.entorno.pivot_msg.type = "alert-danger";
				this.entorno.pivot_msg.mensaje ="No se puede generar el archivo con transacciones de días diferentes.";
			}
			else
			{
				if (tipoTransaccion == 'PP')
				{
					this.service.getRecargas(tipoTransaccion, this.convertFecha(this.fechaDesde), this.convertFecha(this.fechaHasta)).subscribe( response => 
						{

							
							this.transacciones_exportar = response;
							var obj : any = [];
							var data: string;
							var numTransacciones = this.transacciones_exportar.length.toString();
							var parametro: any;
							var fileTime: string = this.showTime().replace(':','');
							this.service.getParametros(tipoTransaccion).subscribe( response =>
								{
									parametro = response;
									var header = parametro.valor+this.formatearFechaConciliacion(this.convertFecha(this.fechaDesde), false, 'PP')+numTransacciones.padStart(7,'0');
									obj.push(header);
									for (var i = 0; i < this.transacciones_exportar.length; i++) 
									{
								
										//var amount : string = Math.floor(this.transacciones_exportar[i].montoRecarga).toString();
										var amount : string = (this.transacciones_exportar[i].montoRecarga.toString()).split(".")[0].replace(",","");

										data = parametro.valor + this.transacciones_exportar[i].referencia_2 + this.formatearFechaConciliacion(this.transacciones_exportar[i].fechaTransaccion, true, 'PP') + 
												this.transacciones_exportar[i].numeroDestino + '0000000001' + amount.padStart(10,'0') + '0015TD0000000000';
										obj.push(data);
									}
									this.loading = false;
						
									this.conciliacionService.exportAsTextFile(obj, parametro.valor+this.formatearFechaConciliacion(this.convertFecha(this.fechaDesde), true, 'PP')+fileTime);
								});
						});
					}
					else
					{
						this.service.getRecargas(tipoTransaccion, this.convertFecha(this.fechaDesde), this.convertFecha(this.fechaHasta)).subscribe( response => 
						{
							this.transacciones_exportar = response;
							var obj : any = [];
							var data: string;
							var parametro: any;
							this.service.getParametros(tipoTransaccion).subscribe( response =>
								{
									parametro = response;
									for (var i = 0; i < this.transacciones_exportar.length; i++) 
									{
										var amountInt = this.transacciones_exportar[i].montoRecarga.split(".")[0].replace(",","");
										var amountDec = this.transacciones_exportar[i].montoRecarga.split(".")[1]+'0000';
										var phoneNumber = '58'+this.transacciones_exportar[i].numeroDestino.substring(1,this.transacciones_exportar[i].numeroDestino.length);
										data = parametro.valor+';0000000001;02;0015;GSM;' + phoneNumber + ';' + this.formatearFechaConciliacion(this.transacciones_exportar[i].fechaTransaccion, true, 'PF') + ';' + this.transacciones_exportar[i].referencia_2 + ';' +amountInt+'.'+amountDec;
										obj.push(data);
									}
									this.loading = false;
									this.conciliacionService.exportAsTextFile(obj, parametro.valor + this.formatearFechaConciliacion(this.convertFecha(this.fechaDesde), false, 'PF') + '_In');	
								});
						});
					}
				}
			}
			else
			{
				this.loading = false;
				this.entorno.pivot_msg.act = true;
				this.entorno.pivot_msg.type = "alert-danger";
				this.entorno.pivot_msg.mensaje ="Debe seleccionar una fecha para generar el archivo de conciliación";
			}
	}
	
	fechaHoy () : string 
	{
		var today : any = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
    	if(dd<10) 
    	{
			dd = '0'+dd
		} 
    	if(mm<10) 
    	{
		 	mm = '0'+mm
		} 
		today = yyyy + '-' + mm + '-' + dd;
		return today;
	}

	showTime() : string
	{
		var timeNow = new Date();
		var hours   = timeNow.getHours();
		var minutes = timeNow.getMinutes();
		var seconds = timeNow.getSeconds();
		var timeString = "" + hours;
		timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
		timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
		//timeString  += (hours >= 12) ? " P.M." : " A.M.";
		return timeString.replace(':','');
		//timerID = setTimeout("showTime()", 1000);
	  }

	formatearFechaConciliacion( fechaBaseDatos : string, campoCuerpo : boolean, tipoDeTransacciones : string) : string
	{
		//2020-01-01T00:01:10.235
		var finalDate : string;
		var dy = fechaBaseDatos.substring(8,10);
		var mt = fechaBaseDatos.substring(5,7);
		var yr = fechaBaseDatos.substring(0,4);				
		var hh = fechaBaseDatos.substring(11,13);
		var mm = fechaBaseDatos.substring(14,16);
		var ss = fechaBaseDatos.substring(17,19);
		var ms = fechaBaseDatos.substring(20,24);
		if(tipoDeTransacciones == 'PP')
		{
			if(campoCuerpo)
			{
				finalDate = dy + mt + yr + hh + mm + ss;
			}
			else
			{
				finalDate = dy + mt + yr;
			}
		}
		else
		{
			if(campoCuerpo)
			{
				finalDate = yr + mt + dy + hh + mm + ss + ms;
			}
			else
			{
				finalDate = yr + mt + dy + hh + mm + ss;
			}
		}
		
		return finalDate;
	}
	
	ngOnInit() 
  	{
	

		this.adapter.setLocale('es'); //datepicker spa

		this.entorno.hideAlert(); //hide aler another or same component
		this.loading = true;
		if ( this.entorno.last_page == this.router.url ) 
		{
			if ( this.entorno.parametros["fechaDesde"] ) 
			{
				this.loading = false;
				this.fechaDesde = this.entorno.parametros["fechaDesde"];
				this.fechaHasta = this.entorno.parametros["fechaHasta"];
				this.telefonoEmisor = this.entorno.parametros["telefonoEmisor"];
				this.telefonoReceptor = this.entorno.parametros["telefonoReceptor"];
				this.concepto = this.entorno.parametros["concepto"];				
				this.referencia = this.entorno.parametros["referencia"];
				//PP = Pre-Pago | PF = Pago de Facturas
				this.buscar("PP", this.ultimo_id);
				this.buscar("PF", this.ultimo_id);
			}else{
				this.loading = false;
			}
		} 
		else 
		{
			this.service.getRecargas("PP",this.fechaHoy(), this.fechaHoy()).subscribe( response => {
				this.recargasRecibidas =  this.entorno.formatearMonto(response,"montoRecarga");
			
				this.n_recargasRecibidas = this.recargasRecibidas.length;
		
				if (this.recargasRecibidas.length == 0) 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = true;
					this.entorno.pivot_msg.type = "alert-danger";
					this.entorno.pivot_msg.mensaje ="No se han emitido pagos el dia de hoy.";
				} 
				else if ( this.recargasRecibidas.length == 1 ) 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = false;
				} 
				else 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = false;
				}
			}, error => {
				if (error.status == 401) 
				{
					this.loading = false;
					this.entorno.clearSession();
					this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
					this.router.navigate(['/']);
				}
			});
	
			this.service.getRecargas("PF",this.fechaHoy(), this.fechaHoy()).subscribe( response => {
				this.pagoDeFacturasRecebidos =  this.entorno.formatearMonto(response,"montoRecarga");
				this.n_pagoDeFacturasRecebidos = this.pagoDeFacturasRecebidos.length;
				if (this.pagoDeFacturasRecebidos.length == 0) 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = true;
					this.entorno.pivot_msg.type = "alert-danger";
					this.entorno.pivot_msg.mensaje ="No se han recibido pagos de factura el dia de hoy.";
				} 
				else if ( this.pagoDeFacturasRecebidos.length == 1 ) 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = false;
				} 
				else
				{
					this.loading = false;
					this.entorno.pivot_msg.act = false;
				}
			}, error => {
				if (error.status == 401) 
				{
					this.loading = false;
					this.entorno.clearSession();
					this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
					this.router.navigate(['/']);	
				}
			});
			this.entorno.last_page = this.router.url;
		}		  
	}

	verMas ( tipo:string, last_id:number ) 
	{
		this.loading = true;
		this.service.getRecargas(tipo, this.convertFecha(this.fechaDesde), this.convertFecha(this.fechaHasta)).subscribe( response => {
			if ( tipo == "PP" ) 
			{
				this.recargasRecibidas =  this.entorno.formatearMonto(response,"montoRecarga");
			
				this.n_recargasRecibidas = this.recargasRecibidas.length;
				if (this.recargasRecibidas.length == 0) 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = true;
					this.entorno.pivot_msg.type = "alert-danger";
					this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";
				} 
				else 
				{
					this.loading = false;
					let temp = this.recargasRecibidas.pop();
					this.ultimo_id = temp.id;
			
					this.entorno.pivot_msg.act = false;
				
				}
			} 
			else 
			{
				this.pagoDeFacturasRecebidos =  this.entorno.formatearMonto(response,"montoRecarga");
			
				this.n_pagoDeFacturasRecebidos = this.pagoDeFacturasRecebidos.length;
				if (this.pagoDeFacturasRecebidos.length == 0) 
				{
					this.loading = false;
					this.entorno.pivot_msg.act = true;
					this.entorno.pivot_msg.type = "alert-danger";
					this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";
				} 
				else 
				{
					this.loading = false;
					let temp = this.pagoDeFacturasRecebidos.pop();
					this.ultimo_id = temp.id;
				
					this.entorno.pivot_msg.act = false;
				
				}
			}
		});
	}


	onSequenceChangeEvent(){
		if(this.telefonoEmisor != null){
			this.telefonoEmisor = this.entorno.limpiarCampo(this.telefonoEmisor.toString(),"numeros");

		}
		if(this.telefonoReceptor != null){
			this.telefonoReceptor = this.entorno.limpiarCampo(this.telefonoReceptor.toString(),"numeros");

		}
	}
	buscar ( tipo:string, last_id:number ) : any
	{
		if(this.telefonoEmisor != null){
			this.telefonoEmisor = this.entorno.limpiarCampo(this.telefonoEmisor.toString(),"numeros");

		}
		if(this.telefonoReceptor != null){
			this.telefonoReceptor = this.entorno.limpiarCampo(this.telefonoReceptor.toString(),"numeros");

		}
		this.loading = true;
		if ( this.fechaDesde == null || this.fechaDesde == "" ) 
		{
			this.loading = false;
			this.entorno.pivot_msg.act = true;
			this.entorno.pivot_msg.type = "alert-danger";
			this.entorno.pivot_msg.mensaje ="Debe seleccionar la fecha desde.";
			this.entorno.hideAlert();

		} 
		else if 
		( this.fechaHasta == null || this.fechaHasta == "" ) 
		{
			this.loading = false;
			this.entorno.pivot_msg.act = true;
			this.entorno.pivot_msg.type = "alert-danger";
			this.entorno.pivot_msg.mensaje ="Debe seleccionar la fecha hasta.";
			this.entorno.hideAlert();

		} 
		else 
		{
			
			this.service.getRecargas(tipo, this.convertFecha(this.fechaDesde), this.convertFecha(this.fechaHasta), this.telefonoEmisor, this.telefonoReceptor, last_id).subscribe( response => {
				if ( tipo == "PP" ) 
				{
					this.loading = true;
					this.recargasRecibidas = this.entorno.formatearMonto(response,"montoRecarga");
					
					
					if (this.recargasRecibidas.length == 0) 
					{
						this.loading = false;
						this.entorno.pivot_msg.act = true;
						this.entorno.pivot_msg.type = "alert-danger";
						this.entorno.pivot_msg.mensaje ="No existen recargas asociados a su criterio de busqueda.";
						this.entorno.hideAlert();
					} 
					else
					{
						this.loading = false;
						this.entorno.pivot_msg.act = false;
						this.n_recargasRecibidas = this.recargasRecibidas.length;
					
					}
				} 
				else 
				{
					this.loading = true;
					this.pagoDeFacturasRecebidos = this.entorno.formatearMonto(response,"montoRecarga");
		
					if (this.pagoDeFacturasRecebidos.length == 0) 
					{
						this.loading = false;
						this.entorno.pivot_msg.act = true;
						this.entorno.pivot_msg.type = "alert-danger";
						this.entorno.pivot_msg.mensaje ="No existen pagos asociados a su criterio de busqueda.";
						this.entorno.hideAlert();
					} 
					else 
					{
						this.loading = false;
						this.entorno.pivot_msg.act = false;
						this.n_pagoDeFacturasRecebidos = this.pagoDeFacturasRecebidos.length;
					
					}
				}
				this.entorno.parametros["fechaDesde"] = this.fechaDesde;
				this.entorno.parametros["fechaHasta"] = this.fechaHasta;
				this.entorno.parametros["telefonoEmisor"] = this.telefonoEmisor;
				this.entorno.parametros["telefonoReceptor"] = this.telefonoReceptor;
				this.loading = false;
			}, error => {
				if (error.status == 401) 
				{
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
	
	addEvent(type: string, event: MatDatepickerInputEvent<Date>) 
	{
        this.events.push(`${type}: ${event.value}`);
	}
}
