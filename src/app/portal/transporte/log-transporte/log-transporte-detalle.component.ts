import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { EntornoService } from '../../../entorno/entorno.service';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import {FormControl} from '@angular/forms';

import {Location} from '@angular/common';
import { LogTransporteService } from './log-transporte.service';

@Component({
    selector: 'app-DetallesTansporteEvento',
    templateUrl: './log-transporte-detalle.component.html',
    styleUrls: ['./log-transporte.component.scss'],
    providers: [
        LogTransporteService,
    ]
  })

export class LogTransporteDetalleComponent implements OnInit
{
    constructor(private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: LogTransporteService,
		private route: ActivatedRoute,
		private _location: Location) {}

	public global_alert = this.entorno.pivot_msg;
	private id : any = this.route.snapshot.params['id'];

	public detalle : any;

	public load : boolean = false;

	public cambioRecurso : any;

	public claves : any;

	public transaccion : any;

    public tarifa:any;
	public logData: any;
	public logClave: string;
	public loading:boolean = true;

	diff(a, b) {
		  var namespace = (namespace || '') + '';

		  var keysInA = Object.keys(a),
		      keysInB = Object.keys(b);

		  var diffA = keysInA.reduce(function(changes, key) {
		    var ns = namespace + key;

		    if(typeof b[key] == 'undefined') {
		      return changes.concat([{ accion: 'BORRADO', parametro: ns }]);
		    }

		    if(a[key] !== b[key]) {
		      return changes.concat([{ accion: 'MODIFICADO', parametro: ns }]);
		    }

		    return changes; 
		  }, []);

		  var diffB = keysInB.reduce(function(changes, key) {
		    var ns = namespace + key;

		    if(typeof a[key] == 'undefined') {
		      return changes.concat([{ accion: 'AGREGADO', parametro: ns }]);
		    }

		    return changes;
		  }, []);

		  return diffA.concat(diffB);
		}

	ngOnInit() {
		this.loading = true;
		this.service.getEvento(this.id).subscribe( response => {

				this.detalle = response;
                if(this.detalle.tarifa == undefined)
                {
                    this.tarifa = 'NO APLICA';
                }
                else
                {
                    this.tarifa = this.entorno.pipeDecimalBigNumber(this.detalle.tarifa);
                }
				if (this.detalle.datos != null)
				{
					
					let datos = {};
					let val = JSON.stringify(this.detalle.datos)
					let json = JSON.parse(val);
					for (let k in json)
					{
						this.logClave = k;
						if(k == 'Consulta de pagos recibidos')
						{
							let pagos = JSON.stringify(json[k]);
							datos[k] = pagos;
						}
						else if(k == 'Consulta de avances')
						{
							let datosAvance = JSON.stringify(json[k]);
							let jsonDatosAvance = JSON.parse(datosAvance);
							datos[k] = this.detalle.datos;
						}
						else if(k == 'Cobro emitido')
						{
							let datosAvance = JSON.stringify(json[k]);
							datos[k] = datosAvance
							
						}
						else
						{
							let valor = JSON.stringify(json[k]);
							datos[k] = valor;
						}
						
					}
					let clave : any = Object.keys( datos );//
					this.claves = clave;//
				}

				
				if ( this.detalle.recursoAntes ) {

					if(this.detalle.recursoAntes!=undefined && this.detalle.recursoAntes.fotoObj != undefined){
						if(this.detalle.recursoAntes.fotoObj.recaudoObj != undefined){
							this.detalle.recursoAntes.fotoObj.recaudoObj = this.detalle.recursoAntes.fotoObj.archivo;
	
						}
	
					}
					
					if ( this.detalle.recursoDespues )
					{
						if(this.detalle.recursoDespues!=undefined && this.detalle.recursoDespues.fotoObj != undefined)
						{
							if(this.detalle.recursoDespues.fotoObj.recaudoObj != undefined){
								this.detalle.recursoDespues.fotoObj.recaudoObj = this.detalle.recursoDespues.fotoObj.archivo;
	
							}
	
		
						}
	
	
						  this.cambioRecurso = this.diff( this.detalle.recursoAntes, this.detalle.recursoDespues );
	
					  }
	
				  }

			  this.loading = false;

	  		this.load = true;

	  	}, error => {
			this.loading = false;

	  		if (error.status == 401) {

				this.entorno.clearSession();

				this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );

	}

	back() {
		this._location.back();
	}

}