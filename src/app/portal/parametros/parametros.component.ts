import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { ParametrosService } from './parametros.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
  providers: [
  	ParametrosService
  ]
})

export class ParametrosComponent implements OnInit {

	constructor(private ref: ChangeDetectorRef, 
		private entornoService: EntornoService,
		private router: Router, 
		private parametrosService: ParametrosService) {}

	public global_alert = this.entornoService.pivot_msg;

	public parametros : any;
	public loading : boolean = false;

	ngOnInit() {
		this.loading=true;
		this.entornoService.last_page = this.router.url
	    
		this.entornoService.hideAlert();

		this.parametrosService.getParametros().subscribe( response => {

	  		this.parametros = response;
			  this.loading=false;

	  	}, error => {
			this.loading=false;

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );

	}

}