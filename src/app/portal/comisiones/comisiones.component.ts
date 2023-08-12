import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { Message, MessageService } from '../../shared/message/message.service';
import { TableInitializer, Column, TableService } from '../../shared/table/table.service';
import { ComisionesService } from './comisiones.service';
import { SubStringCheckPipe } from '../../shared/pipes/subStringCheck.pipe';
import { AfiliadosService } from '../afiliados/afiliados.service';
import { EntornoService } from '../../entorno/entorno.service';
import { DialogAfiliado } from './actualizar-comision/dialog-afiliado';
import { DialogService } from '../../shared/dialogs/dialog.service';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.scss']
})
export class ComisionesComponent implements OnInit, OnDestroy {
  // Basico
  public title: string;
  public loading: boolean;
  public message: Message;
  public messageSubscription: Subscription;
  public tabs: any[];
  public tipoUsuario : string;
  public currentTabIndex: number;
  public currentSubTabIndex: number;
  // forms
  public form: FormGroup;
  // table
  public columns: Column[];
  public comisionTable: TableInitializer;

  public tiposValores : any;
  public operaciones : any;
  public transacciones : any;
  
  public tipoValor : string;
  public operacion : string;
  public transaccion : string;
  public estado : number;
  public actividades: any[];
  public actividadEconomica : any;
  public idActEc: number;

  public tipocomision : string;
  public afiliado: any;
  public keyword = 'descripcion';
  public afiliados: any[];
  
  constructor(

    private messageService: MessageService,
    private router: Router,
    private comisionesService: ComisionesService,
    private tableService: TableService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private subStringPipe: SubStringCheckPipe,
    private afiliadoService: AfiliadosService,
    private entornoService : EntornoService,
    private dialog: MatDialog,
    private dialogService: DialogService,

  ) {
    this.title = "Administración de Comisiones";
    this.initTable();
    // definicion tabla por subtab
    let tables = this.generarTablasPorTab();

    this.tabs = [
      {nombre: 'Por Transacción', descripcion:'', 
        subtabs: [
          {nombre: 'Naturales', descripcion: '', filtro: null, table: tables.tn, showTable: true,}, 
          {nombre: 'Jurídicos', descripcion: '', filtro: null, table: tables.tj, showTable: true,},
        ]},
      {nombre: 'Por Actividad Económica', descripcion: '', 
        subtabs: [
          {nombre: 'Jurídicos', descripcion: '', filtro: null, table: tables.act, showTable: true,},
        ]},
      {nombre: 'Por Afiliado', descripcion: '', 
        subtabs: [
          {nombre: 'Naturales', descripcion: '', filtro: null, table: tables.an, showTable: true,}, 
          {nombre: 'Jurídicos', descripcion: '', filtro: null, table: tables.aj, showTable: true,},
        ]},
    ];

    this.loading = false;
    this.currentTabIndex = 0;
    this.currentSubTabIndex = 0;
    this.onTabChange(this.tabs[0].nombre);
    
    this.afiliado = {id : undefined, nombre : ''};
  }
  limpiar(event):void{
  
 
      if(event.code == "Space") {
        event.preventDefault();
      }else if((new RegExp(/^[A-Za-z]+$/gi).test(event.key.toString())) == false){
        event.preventDefault();
      }
    
  }
  ngOnInit() {
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.loadTipoOperacion();
    this.loadTipoTransaccion();
    // revisar local
    let comisionInfo = this.comisionesService.getComisionInfo();
    if (comisionInfo != undefined) {
      this.comisionesService.deleteComisionInfo();
      this.transaccion = comisionInfo.form.transaccion != 'undefined' ? comisionInfo.form.transaccion : undefined;
      this.estado = comisionInfo.form.estado != 'undefined' ? comisionInfo.form.estado : undefined;
      this.tipoUsuario = comisionInfo.form.tipoUsuario != 'undefined' ? comisionInfo.form.tipoUsuario : undefined;
      this.operacion = comisionInfo.form.operacion != 'undefined' ? comisionInfo.form.operacion : undefined;
      this.actividadEconomica = comisionInfo.form.actividadEconomica != 'undefined' ? comisionInfo.form.actividadEconomica : undefined;
      this.idActEc = comisionInfo.form.idActEc != 'undefined' ? comisionInfo.form.idActEc : undefined;;
      this.currentTabIndex = comisionInfo.tab;
      this.currentSubTabIndex = comisionInfo.subTab;

      this.onTabChange(this.tabs[this.currentTabIndex].nombre);
      this.buscar(this.currentTabIndex, this.currentSubTabIndex);
    }
  }
  
  generarTablasPorTab(): any {
    // por Transaccion Natural
    const tnColumns = this.columns.filter( c => c.id != 'actividadEconomica' && c.id != 'afiliado' && c.id != 'cliente');
    let tnTable = { ...this.comisionTable };
    tnTable.id = 'transNat';
    tnTable.columns = tnColumns;
    // por Transaccion juridica
    const tjColumns = tnColumns;
    let tjTable = { ...tnTable };
    tjTable.id = 'transJur';
    tjTable.columns = tjColumns;
    // por Actividad Economica
    const actColumns = this.columns.filter( c => c.id != 'afiliado' && c.id != 'cliente');
    let actTable = { ...this.comisionTable };
    actTable.id = 'actEc';
    actTable.columns = actColumns; 
    // por Afiliado natural
    const anColumns = this.columns.filter(c => c.id != 'actividadEconomica' && c.id != 'actualizar');
    let anTable = { ...this.comisionTable };
    anTable.id = 'afiliadoN';
    anTable.columns = anColumns;
    // por Afiliado Juridico
    const ajColumns = this.columns.filter(c => c.id != 'actualizar');
    let ajTable = { ...this.comisionTable };
    ajTable.id = 'afiliadoJ';
    ajTable.columns = ajColumns;
    
    return { tn: tnTable, tj: tjTable, act: actTable, an: anTable, aj: ajTable };
  }

  buscar(tabIndex, subTabIndex ){
    let data = [];
    

    this.loading = true;
    this.tabs[tabIndex].subtabs[subTabIndex].showTable = false;
    if(tabIndex == 0){
      //this.loading = true;
      this.comisionesService.findComisions(undefined, this.transaccion, this.estado, this.tipoUsuario, this.operacion)
      .finally(()=> {
        this.tabs[tabIndex].subtabs[subTabIndex].table.data = data;
        this.tabs[tabIndex].subtabs[subTabIndex].showTable = true;
        this.loading = false;
      })
      .subscribe( (response : any) =>{
        data = response;
      });
    }
    if(tabIndex == 1){
      //this.loading = true;
      this.comisionesService.findComisionsActEco(undefined, this.transaccion, this.estado, this.tipoUsuario, this.operacion, this.idActEc)
      .finally(()=> {
        this.tabs[tabIndex].subtabs[subTabIndex].table.data = data;
        this.tabs[tabIndex].subtabs[subTabIndex].showTable = true;
        this.loading = false;
      })
      .subscribe( (response : any) =>{
        data = response;
      });
    }
    if (tabIndex == 2) {
      //this.loading = true;
      let tipoValor = undefined;
      this.revisarAfiliado();
      this.comisionesService.findComisionAfiliado(undefined, this.afiliado.id, this.transaccion, tipoValor, this.tipoUsuario, this.operacion)
      .finally(()=> {
        this.tabs[tabIndex].subtabs[subTabIndex].table.data = data;
        this.tabs[tabIndex].subtabs[subTabIndex].showTable = true;
        this.loading = false;
      })
      .subscribe( (response : any) =>{
        data = response;
      });
    }
    
  }

  excel(stab) {
    this.tableService.exportDataToExcel(
      this.mapDataToExportByAccesor(stab.table.data, stab.table.columns), stab.table.columns, 'comisiones'
    )
  }

  mapDataToExportByAccesor(data: Array<any>, columns: Array<any>): Array<any> {
    return data.map( (element) => {
      let newElement = {};
      columns.forEach( column => {
        if (column.exportable) {
          if (column.type == 'date' && column.accesor(element) != 'undefined') {
            newElement[column.id] = this.datePipe.transform(column.accesor(element), 'dd/MM/yyyy');
          }
          else if (column.type == 'amount' && column.accesor(element) != 'undefined') {
            newElement[column.id] = this.entornoService.pipeDecimalBigNumber(this.entornoService.limpiarMonto(column.accesor(element).toString()))  ;
          }
          else {
            try {
              newElement[column.id] = this.subStringPipe.transform(column.accesor(element));
            }
            catch {
              newElement[column.id] = element[column.id];
            }
          }
        }
      })

      return newElement;
    })
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  onTabChange(Label) {
    let tipocomision : string;
    if(Label == 'Por Transacción') { tipocomision = 'transaccion'; }
    else if(Label == 'Por Actividad Económica') { 
      tipocomision = 'actividad-economica'; 
      this.currentSubTabIndex = 0;
      if (this.actividades == undefined) { this.loadActividades();}
    }  
    else if(Label == 'Por Afiliado')   { 
      tipocomision = 'afiliado'; 
    }  
    this.tipocomision = tipocomision;
    this.onSubtabChange(this.tabs[this.currentTabIndex].subtabs[this.currentSubTabIndex].nombre)
  }

  onSubtabChange(Label) {
    let tipoUsuario : string;
    if(Label == 'Naturales') { 
      tipoUsuario = 'B'; 
    }
    else if(Label == 'Jurídicos')   { 
      tipoUsuario = 'A';  
      if (this.tipocomision == 'afiliado' && this.actividades == undefined) { this.loadActividades();}
    }  
    this.tipoUsuario = tipoUsuario;
    if (this.tipocomision == 'afiliado') { this.loadAfiliados(); }
  }

  revisarAfiliado() {
    this.loading = false;
    if (this.afiliado && this.afiliado.id == undefined && this.afiliado.nombre != undefined && this.afiliado.nombre != "") {
      this.afiliado.id = this.afiliados.find(d => d.identificacion == this.afiliado.nombre).id;
    }
  }

  onActionBuscar(event: any) {
    this.crearComisionInfo(true); // crear comisionInfo con isDisabled true
    this.router.navigate(['/portal/comisiones/', this.tipocomision, this.tipoUsuario, event.object.id]);
  }

  onCrear() {
    this.crearComisionInfo(false);
    this.router.navigate(['/portal/comisiones', this.tipocomision, this.tipoUsuario, 'crear'])
  }

  crearComisionInfo(isDisabled: boolean) {
    // guardar local - {form, diabled, tabs}
    let comisionInfo = {
      form: {
        transaccion: this.transaccion ? this.transaccion : 'undefined',
        estado: this.estado ? this.estado : 'undefined',
        tipoUsuario: this.tipoUsuario,
        operacion: this.operacion ? this.operacion : 'undefined',
        actividadEconomica: this.actividadEconomica ? this.actividadEconomica : 'undefined',
        idActEc: this.idActEc,
      },
      isDisabled: isDisabled,
      tab: this.currentTabIndex,
      subTab: this.currentSubTabIndex,
    }
    this.comisionesService.createComisionInfo(comisionInfo);
  }

  onTableEvents(event) {
    switch (event.event) {
      
      case 'text-action':
        if(event.action == 'modificar') {
          this.crearComisionInfo(false); // guardar comisionInfo local
          this.router.navigate(['/portal/comisiones/', this.tipocomision, this.tipoUsuario, event.object.id]);
        }else
        if(event.action == 'actualizar') {
          let body : any = {
            tipoPersona: this.tipoUsuario,
            tipoTran: event.object.tipoTran,
            tipoOperacion: event.object.tipoOperacion,
            tipoValor: event.object.tipoValor,
            valor: event.object.valor,
            confirmado: false,
            activa: event.object.activa ? true : false
          };

          if(event.object.idActEco){
            body.idActEco = event.object.idActEco;
          }

            this.comisionesService.updateComisionAfiliado(body)
            .subscribe(response => {},
              error => {
          
                if (error.error.mensaje) {
                  this.message = undefined;
                  if(confirm(error.error.mensaje) && error.error.mensaje != 'No existen registros para actualizar.'){
                    this.loading = true;
                    body.confirmado = true;
                    this.comisionesService.updateComisionAfiliado(body)
                    .finally(()=>{this.loading = false;})
                    .subscribe(response => {
                      this.dialogService.showCompleteDialog('Actualizar Afiliados', 'Los Afiliados se han actualizado exitosamente')
                    });
                  }
                }
              } 
            );
          
        }
        delete event.event;
        break;

      case 'action':
        if (event.action == 'buscar') {
          delete event.event;
          this.onActionBuscar(event);
        }
        else {
          console.log(event, 'generar funcion para manejar evento');
        }
        delete event.event;
        break;
      
      default:
        console.log('No se consiguio la funcion de manejo para el evento')
        // console.log(event);
        break;
    }
  }

  initTable() {
    const fileExportName = "RegistrosBancarios";
    this.columns = [
      { id: 'buscar', name:'', type: 'tableEvents', actions: [{state: 'buscar', icon: 'search'}],
        accesor: (element: any) => `${'actions'}`, displayable: false, exportable: false, unsortable: true, },
      { id: 'afiliado', name:'Documento Afiliado', type: 'default',  unsortable: true, // Por Afiliado
        accesor: (element: any) => `${element.afiliado ? element.afiliado.identificacion : ''}`, displayable: true, exportable: true },
      { id: 'cliente', name:'Afiliado', type: 'default',  unsortable: true, displayable: true, exportable: true, // Por Afiliado
        accesor: (element: any) => `${element.afiliado && element.afiliado.cliente ? element.afiliado.cliente.nombreCompleto : ''}` },
      { id: 'actividadEconomica', name:'Actividad Económica', type: 'default',  unsortable: true, // para porActividadEconomica
        accesor: (element: any) => `${element.actividadEconomica ? element.actividadEconomica.descripcion : 
          (element.afiliado && element.afiliado.actividadEconomica ? element.afiliado.actividadEconomica.descripcion : '')}`, 
        displayable: true, exportable: true },
      { id: 'tipoTransaccion', name:'Transacción', type: 'default',  unsortable: true,
        accesor: (element: any) => `${element.tipoTransaccion ? element.tipoTransaccion.descripcion : this.mapTransaccion(element.tipoTran)}`, 
        displayable: true, exportable: true },
      { id: 'tipoValor', name:'Tipo de Valor', type: 'default',  unsortable: true,
        accesor: (element: any) => `${element.tipoValor}`, displayable: true, exportable: true },
      { id: 'valor', name:'Valor', type: 'amount',  unsortable: true, align: 'left' ,
        accesor: (element: any) => `${element.tipoValor == 'MONTO'? this.entornoService.pipeDecimalBigNumber(element.valor) : element.valor}`, displayable: true, exportable: true },
      { id: 'tipoOperacion', name: 'Cobro de la Operación', type: 'default', unsortable: true,
        accesor: (element: any) => `${element.tipoOperacion}`, displayable: true, exportable: true },
      { id: 'estado', name:'Estado', type: 'chip', displayable: true, exportable: true, unsortable: true,
        accesor: (element: any) => `${element.activa == true ? 'A' : 'I'}` },
      { id: 'modificar', name:'', type: 'tableEvents', unsortable: true,
        actions: [{state: 'modificar', icon: 'Modificar'}, ], 
        accesor: (element: any) => `${'text-actions'}`, displayable: false, exportable: false },
      { id: 'actualizar', name:'', type: 'tableEvents', unsortable: true,
        actions: [ {state: 'actualizar', icon: 'Actualizar Afiliados'}], 
        accesor: (element: any) => `${'text-actions'}`, displayable: false, exportable: false },
    ];
    // extractos
    this.comisionTable = {
      hasFooter: false,
      hasFilter: true,
      hasPagination: false,
      expandable: false,
      canChangeColumns: false,
      canExport: false,
      dataInputType: 0,
      data: [],
      columns: this.columns,
      id: 'comisiones',
    };
  }

  mapTransaccion(idTran: number): string {
    let find = this.transacciones.find( t => t.id == idTran);
    if (find != undefined) {
      return find.name;
    }
    else { return undefined }
  }

  loadActividades() {
    this.loading = true;
    this.afiliadoService.getActividades()
    .finally(()=>{
      this.loading = false;
    })
    .subscribe( response => {
      this.actividades = response;
      this.actividades = this.actividades.filter( a => a.visible == true);
    })
  }

  mapActividades(idActEco: number): string {
    if ( this.actividades != undefined ) {
      let find = this.actividades.find( t => t.id == idActEco);
      if (find != undefined) {
        return find.descripcion;
      }
      else { return undefined }
    }
  }

  loadTipoTransaccion() {
    this.loading = true;
    this.comisionesService.findTiposTransaccion()
    .finally(()=>{
      this.loading = false;
    })
    .subscribe(response => {
      this.transacciones = response;
    });
  }
 
  loadTipoOperacion() {
    this.operaciones = [{id : "RECEPTOR", name : "RECEPTOR"}, {id : "EMISOR", name : "EMISOR"}]
  }

  loadAfiliados() {
    this.loading = true;
    this.afiliadoService.getAfiliados(this.tipoUsuario)
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.afiliados = <any[]>response;
    })
  }

  busquedaAfiliado(){
    const dialogAfiliado = this.dialog.open(DialogAfiliado, {
      data : { tipoPersona :  this.tipoUsuario }
    });

    dialogAfiliado.afterClosed().subscribe(data => {

      if (data != undefined) {
        this.afiliado = data;
      }
    
    });
  }

  // autocomplete
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
