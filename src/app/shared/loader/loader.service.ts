import { Injectable } from '@angular/core';
/** Servicio que permite hacer loading automático
 * 
 * Autor: Luis Marval <lmarval@fin-soft.net>
 * 
 * reference: https://stackblitz.com/edit/angular-loader-service?file=app%2Fprogress-spinner-overview-example.ts
 * 
 * ***
 * 
 * **Uso** 
 * 
 * Agregar en interceptor o donde se requiera automatizar el estado de cargando
 ```ts
 // al empezar la carga
 this.loaderService.visibility = true;
 // cuando la carga debe haber terminado
 this.loaderService.visibility = false;
 ```
 * 
 * Agregar en el componente donde se tiene el loader
 * 
 ```ts
 private loaderService: LoaderService, // en constructor
 this.loaderService.onStateChange( state => this.loading = state ); // en init
 ```
 * 
 * Puede existir casos con componentes anidados que hacen llamadas a servicios que el loader no detecte los cambios, 
 * para este tipo de problemas puede manejar la variable del componente de loading manual en esa instancia.
*/
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  /** @ignore */
  private loading: boolean;
  /** @ignore */
  listeners = [];

  /** Inicia loading en false */
  constructor() {
    this.loading = false;
  }

  /** 
   * @author Luis Marval <lmarval@fin-soft.net>
   * 
   * @example 
   * this.loaderService.onStateChange( state => this.loading = state );
   * 
   * @param fn Función para Setear el loader en el componente
   */
  onStateChange(fn) {
    this.listeners.push(fn);
  }

  /** Función que setea el valor del loader */
  set visibility(value: boolean) {
    this.loading = value;
    this.listeners.forEach((fn) => {
      fn(value);
    });
  }

}