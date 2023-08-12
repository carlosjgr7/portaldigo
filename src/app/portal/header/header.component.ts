import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { EntornoService } from '../../entorno/entorno.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  public config: PerfectScrollbarConfigInterface = {};

  public user_name: string = this.entornoService.nombre_completo;

  public ultima_conexion: string = this.entornoService.ultima_conexion;
  
  constructor(private router: Router, private entornoService: EntornoService) {}

  onCerrarSesion() {
    this.entornoService.cerrarSesion().subscribe(
      data => {
        console.debug("La sesión fue cerrada exitosamente");
      },
      error => {
        console.error("No se pudo cerrar la sesión");
      }
    );

    this.router.navigate(['/inicio-sesion']);
  }

}