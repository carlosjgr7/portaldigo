import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { EntornoService } from '../../../entorno/entorno.service';

import { ParametrosTransporteService } from './parametros-transporte.service';
@Component({
  selector: 'app-parametros-transporte',
  templateUrl: './parametros-transporte.component.html',
  styleUrls: ['./parametros-transporte.component.css'],
  providers: [
  	ParametrosTransporteService
  ]
})
export class ParametrosTransporteComponent implements OnInit {

  constructor(private ref: ChangeDetectorRef, 
		public entornoService: EntornoService,
		private router: Router, 
		private parametrosService: ParametrosTransporteService) {}

	public global_alert = this.entornoService.pivot_msg;

	public parametros : any;

  public loading: boolean = true;

	ngOnInit() {
    this.loading = true;
		this.entornoService.last_page = this.router.url
	    
		this.entornoService.hideAlert();

		this.parametrosService.getParametros().subscribe( response => {
      this.loading = false;
	  		this.parametros = response;
			for( let i = 0; i< this.parametros.length; i++)
			{
				if(this.parametros[i].clave == 'tarifa')
				{
					this.parametros[i].valor = this.entornoService.pipeDecimalBigNumber(this.parametros[i].valor)
				}
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

}
