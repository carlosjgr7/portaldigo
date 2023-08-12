import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { Message, MessageService } from '../../shared/message/message.service';
import { LotesService } from './lotes.service';
import { LiquidacionService } from '../liquidacion/liquidacion.service';
import { DialogService } from '../../shared/dialogs/dialog.service';
import { TableInitializer, Column } from '../../shared/table/table.service';
import { EntornoService } from '../../entorno/entorno.service';


@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.scss']
})
export class LotesComponent implements OnInit, OnDestroy {
  // basic
  public title: string;
  public loading: boolean;
  public message: Message;
  public messageSubscription: Subscription;
  public form: FormGroup;
  public today: Date;
  public oneWeekAgo: Date;
  // options
  public cuentasOrigen: any[];
  public estatusLote: any[];
  public estatusOp: any[]; // acciones de lotes
  // table
  public lotesTable: TableInitializer;
  public columns: Column[];
  
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private lotesService: LotesService,
    private liquidacionService: LiquidacionService,
    private dialogService: DialogService,
		private entorno: EntornoService
  ) { 

    this.loading = false;
    this.title = 'Gestión de Lotes';
    this.today = new Date();
    this.oneWeekAgo = new Date();
    this.oneWeekAgo.setDate(this.oneWeekAgo.getDate() - 7);

    this.form = this.formBuilder.group({
      idLote: [null],
      idCuentaOrigen: [null],
      idEstatus: [null],
      desde: [this.oneWeekAgo],
      hasta: [this.today],
    });
  }
  
  ngOnInit() {
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.consultaCuentasOrigen();
    this.consultaEstatusLote();
    this.definirTabla();
  }

  ngOnDestroy() {
    if (this.messageSubscription != undefined) {
      this.messageSubscription.unsubscribe();
    }
  }

  consultaCuentasOrigen() {
    this.loading = true;
    this.liquidacionService.consultaCuentasEmpresa()
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.cuentasOrigen = response;
    })
  }

  consultaEstatusLote() {
    this.loading = true;
    this.lotesService.consultaEstatusLote()
    .finally( () => {
      this.loading = false;
    })
    .subscribe( response => {
      this.estatusLote = response;
    });
  }

  consultaEstatusOp(procesoManual?: number) {
    this.loading = true;
    this.liquidacionService.consultaEstatusOrden(procesoManual)
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.estatusOp = response;
    })
  }

  onFormChange() {
    this.lotesTable.data = [];
  }

  onSearch() {
    this.loading = true;
    const val = this.form.value;
    // limpiar tabla
    let idLote = val.idLote;

    if(idLote != null){
			idLote = this.entorno.limpiarCampo(idLote.toString(),"numeros");

		}
    let data = [];
    this.lotesTable.data = data; 
    this.lotesService.consultaLotes(
      idLote, 
      val.idCuentaOrigen, 
      val.desde, 
      val.hasta, 
      val.idEstatus)
    .finally( () => {
      this.loading = false; 
      // cargar data a tabla
      this.lotesTable.data = data; 
    })
    .subscribe( response => {
      for (let i = 0; i < response.length; i++){
        response[i].monto= this.entorno.pipeDecimalBigNumber(response[i].monto.toString());
        if(response[i].montoAsigLote!=null){
          response[i].montoAsigLote= this.entorno.pipeDecimalBigNumber(response[i].montoAsigLote.toString());
        }
        if(response[i].montoProc!=null){
          response[i].montoProc= this.entorno.pipeDecimalBigNumber(response[i].montoProc.toString());
        }
        if(response[i].montoProcError!=null){
          response[i].montoProcError= this.entorno.pipeDecimalBigNumber(response[i].montoProcError.toString());
        }
        }
      data = response;

    });
  }

  descargarLote(idLote: number, route?: string ): void {
    this.lotesService.obtenerArchivoLote(idLote)
    .subscribe( 
      (resp: HttpResponse<Blob>) => {
        let dataType = resp.body.type;
        if (resp.body.size > 0) {
          let filename = resp.headers.get('content-disposition').substring(22, resp.headers.get('content-disposition').length -1)
          let binaryData = [];
          binaryData.push(resp.body);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          // if (filename) { // quizas caso en que falle filename
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            // }
          }
      });
  }

  onOrdenes(idLote: number) {
    let ordenes;
    let ordenesConAccion;
    let ordenesColumns: Column[] = [
      { id: 'id', name:'N° Orden', type: 'default', 
        accesor: (element: any) => `${element.id}`, displayable: true, exportable: true },
      { id: 'idUsuario', name:'N° Usuario', type: 'default', 
        accesor: (element: any) => `${element.idUsuario}`, displayable: true, exportable: true },
      { id: 'numeroTelefono', name:'Telefono', type: 'default', displayable: true, exportable: true,
        accesor: (element: any) => `${element.afiliado ? element.afiliado.numeroTelefono : ''}`,  },
      { id: 'cuentaEmpresaPagoLote', name:'Cuenta Origen', type: 'default', 
        accesor: (element: any) => `${element.cuentaEmpresaPagoLote}`, displayable: true, exportable: true },
      { id: 'bancoDestino', name:'Banco Destino', type: 'default', displayable: true, exportable: true,
        accesor: (element: any) => `${element.bancoDestino ? element.bancoDestino.nombreCorto : ''}`,  },
      { id: 'monto', name:'Monto', type: 'default', 
        accesor: (element: any) => `${element.retiro ? element.retiro.monto: ''}`, displayable: true, exportable: true},
      { id: 'moneda', name:'Moneda', type: 'default', 
        accesor: (element: any) => `${element.moneda}`, displayable: true, exportable: true },
      { id: 'concepto', name:'Concepto', type: 'default', 
        accesor: (element: any) => `${element.concepto}`, displayable: true, exportable: true },
      { id: 'tipoEstatusOp', name:'Estatus', type: 'default', displayable: true, exportable: true,
        accesor: (element: any) => `${element.tipoEstatusOp ? element.tipoEstatusOp.descripcion: ''}`,  },
      { id: 'reprocesar', name:'', type: 'tableEvents',
        accesor: (element: any) => `${'select'}`, displayable: false, exportable: false },
    ];

    this.liquidacionService.consultaOrdenes(null, idLote)
    .finally( () => {
      this.dialogService.showTableDialog(
        'Ordenes de Pago', 
        'Pertenecientes a Lote N° ' + idLote.toString(),
        ordenesConAccion,
        ordenesColumns
      )
      .then( result => {
        if (result && result.findIndex( d => d.selection != undefined) != -1) {
          let idLote = result[0].idLote
          let ordenPagoList = [];
          result.forEach( r => {
            if (r.selection != undefined) {
              ordenPagoList.push({ id: r.id, idEstatus: r.selection });
            }
          });
          this.lotesService.procesarLote(idLote, ordenPagoList )
          .finally( () => this.onSearch() ) // refrescar lotes
          .subscribe( response => {
            // console.log( response )
            this.dialogService.showCompleteDialog('Atención ', 'Se actualizaron las órdenes de pago satisfactoriamente')
            .then( result => {
              // console.log(result)
            })
          })
        }
      });
    })
    .subscribe( response => {
      for (let i = 0; i < response.length; i++){
        response[i].retiro.monto = this.entorno.pipeDecimalBigNumber(response[i].retiro.monto); 
        }
      ordenes = response;
      const estatusAccion = this.estatusOp.map( e => { return {id: e.id, alias: e.descripcion}});
      ordenesConAccion = ordenes.map( orden => {
        if (orden.accion == undefined && orden.tipoEstatusOp.procesoManual != true ) {
          orden['accion'] = estatusAccion;
        }
        else {
          orden['selectDisabled'] = true;
        }
        return orden;
      })
    })
  }

  onTableEvents(event) {
    switch (event.event) {
      case 'action':
        delete event.event;
        if (event.action == 'descarga') {
          this.descargarLote(event.object.id);
        }
        else if (event.action == 'ordenes') {
          this.consultaEstatusOp(1);
          this.onOrdenes(event.object.id);
        }
        else {
          console.log(event);
        }
        break;
      
      default:
        console.log(event);
        break;
    }
  }

  definirTabla() {
    this.columns = [
      { id: 'ordenes', name:'', type: 'tableEvents', actions: [{state: 'ordenes', icon: 'assignment'}],
        accesor: (element: any) => `${'actions'}`, displayable: false, exportable: true },
      { id: 'fechaProceso', name:'Fecha Proceso', type: 'date', 
        accesor: (element: any) => `${element.fechaProceso}`, displayable: false, exportable: true },
      { id: 'id', name: 'N° Lote', type: 'default', 
        accesor: (element: any) => `${element.id}`, displayable: true, exportable: true },
      { id: 'cuentaOrigen', name: 'Cuenta Origen', type: 'default', 
        accesor: (element: any) => `${element.cuentaOrigen ? element.cuentaOrigen.banco.nombre + ' ****' + (element.cuentaOrigen.cuenta).slice(-4) : ''}`, 
        displayable: true, exportable: true},
      { id: 'medioPagoLiquidacion', name:'Medio de Pago', type: 'default', 
        accesor: (element: any) => `${ element.medioPagoLiquidacion != undefined ? element.medioPagoLiquidacion.nombre : ''}`, 
        displayable: true, exportable: true },
      { id: 'cantOpAsigLote', name:'Ordenes Asignadas a Lote', type: 'default', align: 'center',
        accesor: (element: any) => `${element.cantOpAsigLote}`, displayable: true, exportable: true },
      { id: 'montoAsigLote', name:'Monto Asignado a Lote', type: 'default', align: 'center',
        accesor: (element: any) => `${element.montoAsigLote}`, displayable: true, exportable: true },
      { id: 'cantOpProc', name:'Ordenes Procesadas', type: 'default', align: 'center',
        accesor: (element: any) => `${element.cantOpProc}`, displayable: true, exportable: true },
      { id: 'montoProc', name:'Monto Procesado', type: 'default', align: 'center',
        accesor: (element: any) => `${element.montoProc}`, displayable: true, exportable: true },
      { id: 'cantOpProcError', name:'Ordenes Procesadas con Error', type: 'default', align: 'center',
        accesor: (element: any) => `${element.cantOpProcError}`, displayable: true, exportable: true },
      { id: 'montoProcError', name:'Monto Procesado con Error', type: 'default', align: 'center',
        accesor: (element: any) => `${element.montoProcError}`, displayable: true, exportable: true },
      { id: 'cantOp', name:'Total Ordenes en Lote', type: 'default', align: 'center',
        accesor: (element: any) => `${element.cantOp}`, displayable: true, exportable: true },
      { id: 'monto', name:'Monto Total del Lote', type: 'default', 
        accesor: (element: any) => `${element.monto}`, displayable: true, exportable: true, align: 'center' },
      { id: 'estatus', name:'Estatus', type: 'default', displayable: true, exportable: true,
        accesor: (element: any) => `${element.tipoEstatusLote ? element.tipoEstatusLote.descripcion : ''}`, },
      { id: 'descarga', name:'', type: 'tableEvents', actions: [{state: 'descarga', icon: 'save_alt'}],
        accesor: (element: any) => `${'actions'}`, displayable: false, exportable: true },
    ]; 

    this.lotesTable = {
      hasFooter: false,
      hasFilter: true,
      hasPagination: true,
      expandable: false,
      canChangeColumns: true,
      canExport: true,
      exportData: {filename: this.title, title: this.title},
      dataInputType: 0,
      data: [],
      columns: this.columns,
    }

  }

}
