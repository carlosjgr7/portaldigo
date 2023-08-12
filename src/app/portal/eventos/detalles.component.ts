import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { EventosService } from './eventos.service';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import {FormControl} from '@angular/forms';

import {Location} from '@angular/common';

//
@Component({
  selector: 'app-DetallesEvento',
  templateUrl: './detalles.component.html',
  styleUrls: ['./eventos.component.scss'],
  providers: [
  	EventosService
  ]
})
export class DetallesEventoComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: EventosService,
		private route: ActivatedRoute,
		private _location: Location) {}

	public global_alert = this.entorno.pivot_msg;
	private id : any = this.route.snapshot.params['id'];

	public detalle : any;

	public load : boolean = false;

	public cambioRecurso : any;

	public claves : any;

	public transaccion : any;

	public loading:boolean =true;

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
		this.loading=true;
		this.service.getEvento(this.id).subscribe( response => {
	
				this.detalle = response;
				
				if ( this.detalle.datos ) 
				{
					let info : any = Object.keys( this.detalle.datos );
					this.transaccion = info;
			
					if(this.transaccion == 'Contactos' || this.transaccion == 'Cuentas retiro' || this.transaccion == 'Consulta de pagos emitidos' || 
						this.transaccion == 'Consulta de pagos recibidos' || this.transaccion == 'Consulta de suplementarios')
					{
					
						if(this.detalle.datos[this.transaccion][0] != undefined){
							let datos = {};
							let val = JSON.stringify(this.detalle.datos[this.transaccion][0]);
						
							let json = JSON.parse(val);
							
							for (let k in json)
							{
								let key : string;
								let jsonKey : string;
								if(k == 'cuentaBanco')
								{
									key = k.replace(/([A-Z])/g, ' $1').trim();
									jsonKey = key.charAt(0).toUpperCase()+key.slice(1);
									let cuenta: string = JSON.stringify(json[k]);
									datos[jsonKey] = cuenta.substring(0,5)+'************'+cuenta.substring(17);
								}
								if(k == 'banco' || k == 'canal' || k == 'bancoReceptor')
								{
									key = k.replace(/([A-Z])/g, ' $1').trim();
									jsonKey = key.charAt(0).toUpperCase()+key.slice(1);
									let info 
									if( k == 'bancoReceptor')
									{
										info = JSON.stringify(json[k].nombreCorto);
									}
									else
									{
										info = JSON.stringify(json[k].nombre);
									}
									datos[jsonKey] = info;
								}
								else
								{
									key = k.replace(/([A-Z])/g, ' $1').trim();
									jsonKey = key.charAt(0).toUpperCase()+key.slice(1);
									datos[jsonKey] = json[k]; 
								}
							} 			
							this.detalle.datos = datos;
							let clave : any = Object.keys( datos );//
							this.claves = clave;//
	
						}
					
					}
					if(this.transaccion == 'Recarga Digitel' || this.transaccion == 'PagoRecibido de Factura' || this.transaccion == 'Contacto agregado' ||
						this.transaccion == 'Suplementario agregado' || this.transaccion == 'Solicitud de clave a comercios' || this.transaccion == 'Pago solicitado ' ||
						this.transaccion == 'Validación de línea con servicio Orquestrator' || this.transaccion == 'Pago Anulado')
					{
						let datos = {};
						let val = JSON.stringify(this.detalle.datos[this.transaccion]);
						let json = JSON.parse(val);
						for (let k in json)
						{
							if(k == 'banco')
							{
								let key = k.replace(/([A-Z])/g, ' $1').trim();
								let jsonKey = key.charAt(0).toUpperCase()+key.slice(1);
								datos[jsonKey] = json[k].nombre;
							}
							else
							{
								let key = k.replace(/([A-Z])/g, ' $1').trim();
								let jsonKey = key.charAt(0).toUpperCase()+key.slice(1);
								
								if(jsonKey != 'Firma Digital'){
								
									if(jsonKey == 'Sucursal' && this.transaccion == 'Pago Anulado'){

										let fragmento = JSON.stringify(json[k]);
										if(fragmento.match("contrasena")){
											let pass = fragmento.substring(fragmento.indexOf(',"contrasena":"'),fragmento.indexOf('}'));
								
											datos[jsonKey] = fragmento.replace(pass,"");
										}else{
											datos[jsonKey] = JSON.stringify(json[k]);
										}
										

									}else{
										datos[jsonKey] = json[k];
									}
								
								}
								
							}
						} 	
						this.detalle.datos = datos;
						let clave : any = Object.keys( datos );//
						this.claves = clave;//
					}
					else
					{
						let claves : any = Object.keys( this.detalle.datos );
						this.claves = claves;
					}
				}
		
				if ( this.detalle.recursoAntes ) 
				{
					if(this.detalle.recursoAntes.length > 1)
					{
						for(let i = 0; i < this.detalle.recursoAntes.length; i++)
						{
							if(this.detalle.recursoAntes[i].recaudoObj != undefined)
							{
								this.detalle.recursoAntes[i].recaudoObj = 'Objeto';
							}
						}
					}
					if(this.detalle.recursoAntes != undefined && this.detalle.recursoAntes.recaudos != undefined)
					{
						for( let i = 0; i < this.detalle.recursoAntes.recaudos.length; i++)
						{
							if(this.detalle.recursoAntes[i].recaudoObj != undefined){
								this.detalle.recursoAntes[i].recaudoObj = 'Objeto';//this.detalle.recursoAntes.fotoObj.archivo;	
							}

						}	
					}

					if(this.detalle.recursoAntes != undefined && this.detalle.recursoAntes.recaudoObj != undefined)
					{				
						this.detalle.recursoAntes.recaudoObj = 'Objeto';
					}
					
					if ( this.detalle.recursoDespues )
					{						
						if(this.detalle.recursoDespues.length > 1)
						{
							for(let i = 0; i < this.detalle.recursoDespues.length; i++)
							{
								if(this.detalle.recursoDespues[i].recaudoObj != undefined)
								{
									this.detalle.recursoDespues[i].recaudoObj = 'Objeto';
								}
							}
						}

						if(this.detalle.recursoDespues!=undefined && this.detalle.recursoDespues.recaudos != undefined)
						{
							for( let i = 0; i < this.detalle.recursoDespues.recaudos.length; i++)
							{
								if(this.detalle.recursoDespues.recaudos[i].recaudoObj != undefined)
								{
									this.detalle.recursoDespues.recaudos[i].recaudoObj = 'Objeto';//this.detalle.recursoDespues.recaudos[i].archivo;	
								}
							}									
						}
						
						if(this.detalle.recursoDespues!=undefined && this.detalle.recursoDespues.recaudoObj != undefined)
						{
							this.detalle.recursoDespues.recaudoObj = 'Objeto';
						}	
						this.cambioRecurso = this.diff( this.detalle.recursoAntes, this.detalle.recursoDespues );	
					}	
				}

			this.loading=false;

	  		this.load = true;

	  	}, error => {
			this.loading=false;

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