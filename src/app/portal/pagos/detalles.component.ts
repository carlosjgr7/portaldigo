import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { PagosService } from './pagos.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './detalles.component.html',
  styleUrls: ['./pagos.component.scss'],
  providers: [
  	PagosService
  ]
})
export class DetallesPagoComponent implements OnInit { 

	constructor(private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: PagosService,
		private route: ActivatedRoute) {}

	public global_alert = this.entorno.pivot_msg;

	public pago: any;
	public loading: boolean = false;
	private id : any = this.route.snapshot.params['id'];
    private tipo_movimiento : any = this.route.snapshot.params['tipo_movimiento'];

	

	ngOnInit() {
		this.loading = true;
		this.entorno.hideAlert();
		this.service.getPago(this.id, this.tipo_movimiento).subscribe( response => {
			this.loading = false;			

			  this.pago = response;

			  this.pago.monto = this.entorno.pipeDecimalBigNumber(this.pago.monto.toString());
		
	  	} );
	}

}