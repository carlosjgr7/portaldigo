import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { EntornoService } from '../../entorno/entorno.service';

import { DashboardService } from './dashboard.service';

import BigNumber from "bignumber.js";


var element_data: any = [];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    DashboardService
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private ref: ChangeDetectorRef,
    private entornoService: EntornoService,
    private router: Router,
    private service: DashboardService) { }

  public global_alert = this.entornoService.pivot_msg;

  public tablero: any;

  public load: boolean = false;
  public loading : boolean = false;


  private formatterMount(mount: any) {

    var noDecimal: boolean = false;

    if (mount % 1 == 0) {

      noDecimal = true;

    }
    

    var valor = this.entornoService.pipeDecimalBigNumber(mount.toString());
 
    return valor;

  }

  ngOnInit() {
    this.loading = true; 
    this.entornoService.last_page = this.router.url


    
    this.service.tablero().subscribe(response => {

      this.tablero = response;
      this.loading = false; 
      this.tablero.montoPagosEnviadosHoy = this.formatterMount(this.tablero.montoPagosEnviadosHoy);
      this.tablero.montoPagosRecibidosHoy = this.formatterMount(this.tablero.montoPagosRecibidosHoy);

      this.load = true;

    }, error => {
      this.loading = false; 

      this.entornoService.clearSession();

      this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

      this.router.navigate(['/']);

    });

  }

}