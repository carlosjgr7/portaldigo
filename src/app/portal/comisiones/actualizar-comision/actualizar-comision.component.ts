import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { isNumeric } from 'jquery';

import { MessageService, Message } from '../../../shared/message/message.service';
import { ComisionesService } from '../comisiones.service';
import { DialogAfiliado } from './dialog-afiliado';
import { DialogService } from '../../../shared/dialogs/dialog.service';
import { EntornoService } from '../../../entorno/entorno.service';
import BigNumber from 'bignumber.js';

interface afiliado {
  id : number;
  nombre: String;
}

@Component({
  selector: 'app-actualizar-comision',
  templateUrl: './actualizar-comision.component.html',
  styleUrls: ['./actualizar-comision.component.scss']
})
export class ActualizarComisionComponent implements OnInit {

  public tiposValores : any;
  public operaciones : any;
  public transacciones : any;

  public actividades: any;
  public actividadesEconomicas : any;
  public categorias: any[];
  public categoriaEconomica : any;
  public actividadEconomica : any;
  public idActEc: number;
  
  public tipoValor : string;
  public operacion : string;
  public transaccion : string;
  public estatus : boolean;
  public valor : string;
  public tipoPersona : string;

  public id : number;
  public afiliado : afiliado;

  public message: Message;
  public messageSubscription: Subscription;
  public isDesabled : boolean;

  public tipocomision : number;
  public loading : boolean;
  public comisionNueva : boolean;

  public keyword = 'descripcion';

  constructor(
    private comisionesService : ComisionesService,
    private messageService: MessageService,
    private route : ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private entornoService: EntornoService
  ) { }

  ngOnInit() {
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.route.params.subscribe(params => {
      switch(params['transaccion']){
        case 'transaccion' : 
          this.tipocomision = 1; 
          switch(params['tipo']){
            case 'A' : this.tipoPersona = params['tipo']; break; 
            case 'B' : this.tipoPersona = params['tipo']; break; 
            default : this.tipoPersona = undefined; break; 
          }
          break;
        case 'actividad-economica' : 
          this.tipocomision = 2;
          this.tipoPersona = params['tipo'] == 'A' ? params['tipo'] : undefined;
          this.loadActividadesEconomicas(); // para nuevas
          break;
        case 'afiliado' : 
          this.afiliado = {id : undefined, nombre : ''};
          this.tipocomision = 3;
          switch(params['tipo']){
            case 'A' : this.tipoPersona = params['tipo']; break;
            case 'B' : this.tipoPersona = params['tipo']; break;
            default : this.tipoPersona = undefined; break;
          }
          break;
      }
      
      if(isNumeric(params['id']) ){
        this.id = +params['id'];
        this.loadComision();
        let dataStorage = this.comisionesService.getComisionInfo();
        if(dataStorage){
          this.isDesabled = dataStorage.isDisabled;
        }
      }
    });
    this.estatus = true;
    this.loadTipoValor();
    this.loadTipoOperacion();
    this.loadTipoTransaccion();

  }


  loadTipoTransaccion() {
    this.comisionesService.findTiposTransaccion()
    .subscribe(response => {
      this.transacciones = response;
    });
  }

  loadTipoValor() {
    this.tiposValores = [{id : "PORCENTAJE", name : "PORCENTAJE"}, {id : "MONTO", name : "MONTO"}]
  }
 
  loadTipoOperacion() {
    this.operaciones = [{id : "RECEPTOR", name : "RECEPTOR"}, {id : "EMISOR", name : "EMISOR"}]
  }

  loadActividadesEconomicas() {
    this.loading = true;
    this.comisionesService.findTiposActividadesEconomicas()
    .finally(()=>{
      this.loading = false;
    })
    .subscribe(response =>{
      this.actividades = response;
      this.categorias = this.actividades.filter( a => a.visible != true);
      this.actividadesEconomicas = this.actividades.filter( a => a.visible == true);
      if (this.idActEc) {
        let subCat = this.actividadesEconomicas.find( a => a.id == this.idActEc);
        this.actividadEconomica = this.actividadesEconomicas.find( a => a.id == this.idActEc).descripcion;
        this.categoriaEconomica = this.categorias.find( c => c.id == subCat.id_padre).descripcion;

      }
    });
  }

  loadComision() {
    if(this.tipocomision == 1){
      this.loading = true;
      this.comisionesService.findComisions(this.id, undefined, undefined, undefined, undefined)
      .finally(() => {  this.loading = false; })
      .subscribe( (element : any) => {
        this.tipoValor = element[0].tipoValor;
        this.transaccion = element[0].tipoTran;
        if(this.tipoValor == 'PORCENTAJE'){
          this.valor = element[0].valor;
        }
        if(this.tipoValor == 'PORCMONTOENTAJE'){
          this.valor = this.entornoService.pipeDecimalBigNumber(element[0].valor);
        }
        this.estatus = element[0].activa ? true : false;
        this.operacion = element[0].tipoOperacion;
      });
    }
    if(this.tipocomision == 2){
      this.loading = true;
      this.comisionesService.findComisionsActEco(this.id, undefined, undefined, undefined, undefined, this.actividadEconomica)
      .finally(() => {  
        this.loading = false; 
        this.loadActividadesEconomicas();
      })
      .subscribe((element : any) => {
        this.tipoValor = element[0].tipoValor;
        this.transaccion = element[0].tipoTran;
        if(this.tipoValor == 'PORCENTAJE'){
          this.valor = element[0].valor;
        }
        if(this.tipoValor == 'PORCMONTOENTAJE'){
          this.valor = this.entornoService.pipeDecimalBigNumber(element[0].valor);
        }
        this.estatus = element[0].activa ? true : false;
        this.operacion = element[0].tipoOperacion;
        this.idActEc = element[0].idActEco
      });
    }
    if(this.tipocomision == 3){
      this.loading = true;
      this.comisionesService.findComisionAfiliado(this.id, undefined, undefined, undefined, undefined, undefined)
      .finally(() => {  this.loading = false; })
      .subscribe((element : any) => {
        this.tipoValor = element[0].tipoValor;
        this.transaccion = element[0].tipoTran;
        if(this.tipoValor == 'PORCENTAJE'){
          this.valor = element[0].valor;
        }
        if(this.tipoValor == 'PORCMONTOENTAJE'){
          this.valor = this.entornoService.pipeDecimalBigNumber(element[0].valor);
        }
        this.estatus = element[0].activa ? true : false;
        this.operacion = element[0].tipoOperacion;
        this.afiliado = { id : element[0].idAfiliado, nombre : element[0].afiliado.identificacion };
      });
    }
  }
//
  onChangeTipoValor(){
    this.valor='';
    if(this.tipoValor == 'PORCENTAJE' && this.valor!= undefined){
      let value = this.valor.replace(',',".");
      if(+value > 100) {
        this.valor = '100';
      }
    }
    if(this.tipoValor == 'MONTO' && this.valor!= undefined)
    {
      if(+this.valor > 0)
      {
        this.valor = this.entornoService.pipeDecimalBigNumber(this.valor)
      }
    }
  }

  onGuardar(){
    let valor;
    if(this.tipoValor == 'PORCENTAJE')
    {
      valor = this.valor.toString().replace(',',".");
    }
    if(this.tipoValor == 'MONTO')
    {
      valor = this.entornoService.limpiarMonto(this.valor)

    }
    //(this.servicio.limpiarMonto(this.dataPago.amount.toString())).isZero() 
    if(new BigNumber("0").isGreaterThanOrEqualTo(new BigNumber(this.entornoService.limpiarMonto(valor).toString()))){
      this.messageService.updateMessage({class: 'alert-danger', text: 'Debe ingresar un valor mayor a cero'});

    }else{
      let body : any = {
        tipoTran : this.transaccion,
        tipoValor : this.tipoValor,
        valor :  valor,
        activa : this.estatus ? 1 : 0,
        tipoOperacion : this.operacion,
        tipoPersona : this.tipoPersona
      };
  
      if(this.id > 0) { body.id = this.id; }
          
      if(this.tipocomision == 1) { 
        this.loading = true;
        this.comisionesService.createComision(body)
        .finally(() =>{this.loading = false; })
        .subscribe( (response : any)  =>  {
          this.comisionNueva = body.id ? false : true;
          this.mensajeExitoso();
  
        });
      };
      if(this.tipocomision == 2) { 
        this.loading = true;
        body.idActEco = this.idActEc;
        this.comisionesService.createComisionActEco(body)
        .finally(() =>{this.loading = false; })
        .subscribe( (response : any)  =>  {
          this.comisionNueva = body.id ? false : true;
          this.mensajeExitoso();
        });
      };
      if(this.tipocomision == 3) { 
        this.loading = true;
        body.idAfiliado = this.afiliado.id;
        this.comisionesService.createComisionAfiliado(body)
        .finally(() =>{this.loading = false; })
        .subscribe( (response : any)  =>  {
          this.comisionNueva = body.id ? false : true;
          this.mensajeExitoso();
        });
      };
    }

 
    
  }

  mensajeExitoso() {
    this.loading =  false;
    let mensaje : string
    mensaje = this.comisionNueva ? 
    'El Registro de comisión fue conciliado exitosamente' : 
    'Se actualizo la comisión satisfactoriamente';

    this.dialogService.showCompleteDialog('Atención ', mensaje)
      .then( result => {
    })

  }


  busquedaAfiliado(){
    const dialogAfiliado = this.dialog.open(DialogAfiliado, {
      height: '80%',
      width: '60%',
      data : { tipoPersona :  this.tipoPersona }
    });

    dialogAfiliado.afterClosed().subscribe(data => {

      if (data != undefined) {
        this.afiliado = data;
      }
    
    });
  }

    // autocomplete
    selectEventCategoria(item) {
      // do something with selected item
    }
   
    onChangeSearchCategoria(val: string) {
      // fetch remote data from here
      // And reassign the 'data' which is binded to 'data' property.
      this.actividadEconomica = undefined;
      this.idActEc = undefined;
    }
    
    onFocusedCategoria(e){
      // do something when input is focused
    }

    onClearCategoria(e) {
      this.categoriaEconomica = undefined;
      this.actividadEconomica = undefined;
      this.idActEc = undefined;
    }
  
    onClosedCategoria(event) {
      // revisar el input y borrar si no hay match
      if (typeof(this.categoriaEconomica) != 'object') {
        this.categoriaEconomica = undefined;
        this.actividadEconomica = undefined;
      }
      else {
        this.actividadesEconomicas = this.actividades.filter( a => a.id_padre == this.categoriaEconomica.id );
      }
    }

    selectEvent(item) {
      // do something with selected item
    }
   
    onChangeSearch(val: string) {
      // fetch remote data from here
      // And reassign the 'data' which is binded to 'data' property.
    }
    
    onFocused(e){
      // do something when input is focused
    }
  
    onClosed(event) {
      // revisar el input y borrar si no hay match
      if (typeof(this.actividadEconomica) != 'object') {
        this.actividadEconomica = undefined;
        this.idActEc = undefined;
      }
      else {
        this.idActEc = this.actividadEconomica.id;
        this.actividadEconomica = this.actividadEconomica.descripcion;
      }
    }

}
