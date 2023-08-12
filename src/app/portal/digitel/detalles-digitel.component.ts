import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

import { DigitelService } from './digitel.service';
import { DigitelComponent } from './digitel.component';

@Component({
  selector: 'app-digitel',
  templateUrl: './detalles-digitel.component.html',
  styleUrls: ['./digitel.component.scss'],
  providers: [
    DigitelService,
    DigitelComponent
  ]
})
export class DetallesDigitelComponent implements OnInit
{
  constructor(private ref: ChangeDetectorRef, 
		private entorno: EntornoService, 
		private router: Router, 
		private service: DigitelService,
		private route: ActivatedRoute) {}

  public global_alert = this.entorno.pivot_msg;
  public success: boolean = false;

	public recarga: any;
  public loading: boolean = false;
  private id : any = this.route.snapshot.params['id'];

  
    ngOnInit(): void 
    {
      this.loading = true;
      this.entorno.hideAlert();

      this.service.getRecargaDetalle(this.id).subscribe(response => {
        this.loading = false;
        this.success = true;
        
        this.recarga = response;

        var valor =  this.recarga.montoRecarga;
        this.recarga.montoRecarga = this.entorno.pipeDecimalBigNumber(valor.toString());
        } , error => {
          this.success = false;
            if (error.status == 401) 
            {
              this.entorno.clearSession();
              this.entorno.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
              this.router.navigate(['/']);
            }
      });
    }
    
}