import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Message, MessageService } from '../../shared/message/message.service';
import { BancosService } from '../bancos/bancos.service';
import { LiquidacionService } from './liquidacion.service';
import { DialogService } from '../../shared/dialogs/dialog.service';
import { TableInitializer, Column } from '../../shared/table/table.service';
import { EntornoService } from '../../entorno/entorno.service';

import BigNumber from "bignumber.js";

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.scss']
})
export class LiquidacionComponent implements OnInit, OnDestroy {
  //  Basic
  public title: string;
  public message: Message;
  public messageSubscription: Subscription;
  public loading: boolean;
  public form: FormGroup;
  public today: Date;
  public oneWeekAgo: Date;
  // options
  public estatusOrdenes: any[];
  public mediosPago: any[];
  public cuentasOrigen: any[];
  public bancosActivos: any[]; // empresa?
  // funcion Resumen
  public showResumen: boolean;
  public formResumen: FormGroup;
  public resumen: any;
  public bancosDestino: any[]; // para calcular bancoDestino
  public clientesSeleccionados: any[];
  // table
  public liquidacionTable: TableInitializer;
  public columns: Column[];
  public tableData: any[];
  public ordenesEnLote: any[];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private bancosService: BancosService,
    private liquidacionService: LiquidacionService,
    private dialogService: DialogService,
		private entorno: EntornoService
  ) {

    this.loading = false;
    this.title = 'Liquidación Ordenes de Pago';
    this.form = this.formBuilder.group({
      idEstatus: [1, [Validators.required]],
      idMedioPago: [null],
      idCuentaOrigen: [null],
      idBancoDestino: [null],
      idLote: [null],
      desde: [this.oneWeekAgo],
      hasta: [this.today],
    });

    this.showResumen = false;
    this.formResumen = this.formBuilder.group({
      cuentaOrigen: [null, [Validators.required]],
    });

    this.tableData = [];
  }

  ngOnInit() {
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.consultaEstatusOrdenes();
    this.consultaBancosActivos();
    this.consultaMediosPago();
    this.consultaCuentasOrigen();
    this.definiendoTabla();
  }

  ngOnDestroy() {
    if (this.messageSubscription != undefined) {
      this.messageSubscription.unsubscribe();
    }
  }

  consultaEstatusOrdenes() {
    this.loading = true;
    this.liquidacionService.consultaEstatusOrden()
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.estatusOrdenes = response;
    })
  }

  consultaBancosActivos() {
    this.loading = true;
    this.bancosService.getBancosActivos(1)
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.bancosActivos = response;
    })
  }

  consultaMediosPago() {
    this.loading = true;
    this.liquidacionService.consultaMediosPago()
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.mediosPago = response;
    })
  }

  consultaCuentasOrigen() {
    this.loading = true;
    this.liquidacionService.consultaCuentasEmpresa()
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.cuentasOrigen = response;
    })
  }

  onFormChange() {
    // limpiar tabla
    this.tableData = [];
    this.liquidacionTable.data = this.tableData;
    // limpiar funcion resumen
    this.definirResumen();
    this.showResumen = false;
  }

  onSearch() {

    this.loading = true;
    const values = this.form.value;
    // limpiar tabla
    let idLote = values.idLote;

    if(idLote != null){
			idLote = this.entorno.limpiarCampo(idLote.toString(),"numeros");

		}
    this.tableData = [];
    this.liquidacionTable.data = this.tableData;
    this.liquidacionService.consultaOrdenes(
      values.idEstatus,
      idLote,
      values.desde,
      values.hasta,
      values.idBancoDestino,
      values.idMedioPago,
      values.idCuentaOrigen,
    )
    .finally( () => {
      this.loading = false;
      if (values.idEstatus != 1) { 
        // mostrar tabla si el estatus es distinto de por procesar
        const filterColumns = this.columns.filter( c => c.id != 'checkAll');
        this.liquidacionTable.columns = filterColumns;
        this.liquidacionTable.data = this.tableData;
      }
      else {
        this.showResumen = true;
        this.definirResumen();
        // mostrar checkAll, si se filtro
        this.liquidacionTable.columns = this.columns;
        // valor de cuenta origen para mostrar la tabla auto
        this.formResumen.controls['cuentaOrigen'].setValue(1);
        this.onCuentaOrigen();
      }
    })
    .subscribe( response => {
    	for (let i = 0; i < response.length; i++){
        response[i].retiro.monto = this.entorno.pipeDecimalBigNumber(response[i].retiro.monto); 
        }
      this.tableData =  response;

    })
  }

  onCuentaOrigen() {
    const valCuenta = this.formResumen.value.cuentaOrigen;
    // al tener una cuenta origen se muestra la tabla
    if (this.tableData.length > 0 && valCuenta != undefined && valCuenta != null) {
      this.liquidacionTable.data = [];
      this.liquidacionTable.data = this.tableData;
    }
    else {
      this.liquidacionTable.data = [];
    }
  }

  definirResumen(evento?: any) {
    let puedeAgregar = false;
    let nuevo;
    if (evento) {
      nuevo = this.calcularResumen(evento);
      puedeAgregar = true;
    }
    else { 
      // limpiar o inicializar variables de calculo
      this.formResumen.reset();
      this.bancosDestino = [];
      this.ordenesEnLote = [];
      this.clientesSeleccionados = [];
    }
    this.resumen = {
      cantidadOrdenes: puedeAgregar ? nuevo.cantidad : 0,
      monto: puedeAgregar ? nuevo.monto : 0,
      medioPago: puedeAgregar ? nuevo.medioPago :'',
      bancoDestino: puedeAgregar ? nuevo.bancoDestino : '',
      cantidadClientes: puedeAgregar ? nuevo.cantidadClientes : 0,
    }
  }

  calcularResumen(evento: any): any {
    let monto; let medioPago;
    const orden = evento.object;
    var sum = BigNumber.sum(new BigNumber(this.entorno.limpiarMonto(this.resumen.monto.toString())),new BigNumber(this.entorno.limpiarMonto(orden.retiro.monto.toString()))) ;
    if (evento.checked == true) {
      monto = orden.retiro && new BigNumber(this.entorno.limpiarMonto(orden.retiro.monto.toString())).isGreaterThan(new BigNumber("0")) 
      ? sum  : new BigNumber(this.entorno.limpiarMonto(this.resumen.monto.toString()));
      // medioPago - por ahora ponemos en tranferencia mientras se sabe si hay interbancaria
      medioPago = 'Transferencia Interbancaria';
    }
    else {
      var rest = new BigNumber(this.entorno.limpiarMonto(this.resumen.monto.toString())).minus(new BigNumber(this.entorno.limpiarMonto(orden.retiro.monto.toString())));
      monto = orden.retiro &&  new BigNumber(this.entorno.limpiarMonto(orden.retiro.monto.toString())).isGreaterThan(new BigNumber("0")) 
      ? rest : new BigNumber(this.entorno.limpiarMonto(this.resumen.monto.toString()));
      //  medioPago
      medioPago = this.ordenesEnLote.length > 0 ? 'Transferencia Interbancaria' : '';
    }
    monto = this.entorno.pipeDecimalBigNumber(monto);
    const cantidad = this.ordenesEnLote.length;
    const bancoDestino = this.calcularBancoDestino(orden.bancoDestino, evento.checked);
    this.calcularCantidadClientes(orden.afiliado, evento.checked); // modifica clientesSeleccionados
    const cantidadClientes = this.clientesSeleccionados.length;
    return {cantidad, monto, bancoDestino, cantidadClientes, medioPago}
  }

  calcularBancoDestino(ordenDestino: any, checked: boolean): string {
    let bancoDestino;
    if (checked == true) {
      if (ordenDestino && this.resumen.bancoDestino == '') {
        bancoDestino = ordenDestino.nombreCorto;
        this.bancosDestino.push({banco: bancoDestino, count: 1});
      }
      else if (ordenDestino && this.resumen.bancoDestino == ordenDestino.nombreCorto) {
        bancoDestino = this.resumen.bancoDestino;
        let bancoArray = this.bancosDestino.find( b => b.banco == bancoDestino);
        if (bancoArray) { bancoArray.count = bancoArray.count + 1; }
      }
      else if (ordenDestino && this.resumen.bancoDestino != '' && this.resumen.bancoDestino != ordenDestino.nombreCorto ) { 
        bancoDestino = 'Multibanco';
        let bancoArray = this.bancosDestino.find( b => b.banco == ordenDestino.nombreCorto);
        if (bancoArray) { bancoArray.count = bancoArray.count + 1; }
        else { this.bancosDestino.push({banco: ordenDestino.nombreCorto, count: 1}); }
      }
      else {
        bancoDestino = this.resumen.bancoDestino;
      }
    }
    else {
      if (ordenDestino && this.resumen.bancoDestino == ordenDestino.nombreCorto) {
        let bancoArray = this.bancosDestino.find( b => b.banco == ordenDestino.nombreCorto);
        if (bancoArray) { bancoArray.count = bancoArray.count - 1; }
        if (bancoArray && bancoArray.count == 0) { this.bancosDestino = []; bancoDestino = '';}
        else if (bancoArray && bancoArray.count > 0) { bancoDestino = this.resumen.bancoDestino}
      }
      else if (ordenDestino && this.resumen.bancoDestino == 'Multibanco') {
        let bancoArray = this.bancosDestino.find( b => b.banco == ordenDestino.nombreCorto);
        if (bancoArray) { bancoArray.count = bancoArray.count - 1; }
        if (bancoArray && bancoArray.count == 0) { 
          let indexBanco = this.bancosDestino.indexOf(bancoArray);
          this.bancosDestino.splice(indexBanco, 1);
          if (this.bancosDestino.length == 0) { bancoDestino = ''; }
          else if (this.bancosDestino.length == 1) { bancoDestino = this.bancosDestino[0].banco; }
          else { bancoDestino = 'Multibanco'; }
        }
        else if (bancoArray && bancoArray.count > 0) { bancoDestino = this.resumen.bancoDestino}
      }
      else {
        bancoDestino = this.resumen.bancoDestino;
      }

    }
    return bancoDestino;
  }

  calcularCantidadClientes(ordenAfiliado: any, checked: boolean) {
    let cliente = this.clientesSeleccionados.find( c => c.idCliente == ordenAfiliado.idCliente);
    if (checked) {
      if (cliente != undefined) {
        cliente['count'] = cliente['count'] +1;
      }
      else {
        this.clientesSeleccionados.push({idCliente: ordenAfiliado.idCliente, count: 1});
      }
    }
    else {
      cliente.count = cliente.count - 1;
      if (cliente.count == 0) { 
        let indexCliente = this.clientesSeleccionados.findIndex(c => c.idCliente == ordenAfiliado.idCliente);
        this.clientesSeleccionados.splice(indexCliente, 1);
      }  
    }
  }

  onCheck(event) {
    const idOrden = event.object.id;
   
    if (event.checked == true ) { // check
      this.ordenesEnLote.push({id: idOrden});
    }
    else { // uncheck
      const enLoteIndex = this.ordenesEnLote.findIndex( o => o.id == idOrden);
      this.ordenesEnLote.splice(enLoteIndex, 1);
    }
    // actualizar resumen
    this.definirResumen(event);
  }

  onCheckAll(event) {
    if (event.checked == true) {
      // evitar duplicados, limpiar variables resumen
      this.bancosDestino = [];
      this.ordenesEnLote = [];
      this.clientesSeleccionados = [];
      this.resumen = {
        cantidadOrdenes: 0,
        monto: 0,
        medioPago: '',
        bancoDestino: '',
        cantidadClientes: 0,
      }
    }
    event.objects.forEach(obj => {
      this.onCheck({checked: event.checked, object: obj});
    });
  }

  generarLote() {
    const idCuentaOrigen = this.formResumen.value.cuentaOrigen;
    const idMedioPago = 1;
    this.dialogService.showConfirmDialog(this.title, '¿Está seguro que desea realizar los cambios?')
    .then( result => {
      if (result == 1) {
        this.loading = true;
        // llamada servicio
        this.liquidacionService.crearLote(idCuentaOrigen, idMedioPago, this.ordenesEnLote)
        .finally( () => this.loading = false)
        .subscribe( 
          // descargar archivo
          (resp: HttpResponse<Blob>) => {
            let dataType = resp.body.type;
            if (resp.body.size > 0) {
              let filename = resp.headers.get('content-disposition').substring(22, resp.headers.get('content-disposition').length -1);
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

            this.dialogService.showCompleteDialog('Atención ', 'Se actualizaron los registros satisfactoriamente')
            .then( result => {
              this.onSearch();
            })

          },
          async (error) => {
            // se maneja de esta forma, ya que llega en forma de Blob
            if (typeof(error.error) == 'object') {
              let err = JSON.parse(await error.error.text())
              console.log(err)
              this.messageService.updateMessage({class:  'alert-danger',text: err[0].mensaje });
            }
            else {
              // validaciones para otros posibles caso, no ha sido probado, asi era antes
              this.messageService.updateMessage({class:  'alert-danger',text: error.error[0].mensaje });
            }
          }
        );
      }
    })

  }

  onTableEvents(event) {
    switch (event.event) {
      case 'checkAll':
        delete event.event;
        if (event.tableId == 'liquidacion') { this.onCheckAll(event); }
        else { console.log('No se consiguio la funcion de manejo para el evento')}
        break;

      case 'check':
        delete event.event;
        if (event.tableId == 'liquidacion') { this.onCheck(event); }
        else { console.log('No se consiguio la funcion de manejo para el evento')}
        break;
      
      default:
        console.log('No se consiguio la funcion de manejo para el evento')
       
        break;
    }
  }

  definiendoTabla() {
    const exportFilename = "ordenesPago";
    this.columns = [
      { id: 'fregistro', name: 'Fecha Registro', type: 'date', displayable: false, exportable: true,
        accesor: (element: any) => `${element.fregistro}`, },
      { id: 'id', name: 'N° Orden', type: 'default', displayable: false, exportable: true,
        accesor: (element: any) => `${element.id}`, },
      { id: 'idUsuario', name: 'Afiliado', displayable: true, exportable: true,
        accesor: (element: any) => `${element.idUsuario}`, type: 'default'},
      { id: 'idRetiro', name: 'N° Retiro', displayable: false, exportable: true,
        accesor: (element: any) => `${element.idRetiro}`, type: 'default'},
      { id: 'referencia', name: 'Referencia', displayable: true, exportable: true,
        accesor: (element: any) => `${element.retiro ? element.retiro.referencia: ''}`,type: 'default'},
      { id: 'bancoDestino', name: 'Banco Destino', displayable: false, exportable: true,
        accesor: (element: any) => `${element.bancoDestino ? element.bancoDestino.nombreCorto : ''}`,  type: 'default'},
      { id: 'monto', name: 'Monto', type: 'default', displayable: false, exportable: true, align: 'left',  
        accesor: (element: any) => `${element.retiro ? element.retiro.monto: ''}`,},
      // { id: 'moneda', name: 'Moneda', type: 'default', displayable: false, exportable: true, 
      //   accesor: (element: any) => `${element.moneda}`,},
      { id: 'tipoEstatusOp', name: 'Estado', displayable: false, exportable: true, 
        accesor: (element: any) => `${element.tipoEstatusOp ? element.tipoEstatusOp.descripcion: ''}`,type: 'default'},
      { id: 'checkAll', name: '', type: 'tableEvents', displayable: true, exportable: false, 
        accesor: (element: any) => `${'check'}`},
    ];
    this.liquidacionTable = {
      hasFooter: false,
      hasFilter: true,
      hasPagination: true,
      expandable: false,
      canChangeColumns: true,
      canExport: true,
      exportData: {filename: exportFilename, title: this.title},
      dataInputType: 0,
      data: [],
      columns: this.columns,
      id: 'liquidacion',
    };
  }

}
