import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { RecargasService } from './recargas.service';
import { BancosService } from '../bancos/bancos.service';
import { Message, MessageService } from '../../shared/message/message.service';
import { RegistrosBancariosService } from '../registros-bancarios/registros-bancarios.service';
import { DialogService } from '../../shared/dialogs/dialog.service';
import { TableInitializer, Column } from '../../shared/table/table.service';
import { EntornoService } from '../../entorno/entorno.service';


@Component({
  selector: 'app-recargas',
  templateUrl: './recargas.component.html',
  styleUrls: ['./recargas.component.scss']
})
export class RecargasComponent implements OnInit, OnDestroy {
  public global_alert = this.entorno.pivot_msg;
  // Basic
  public title: string;
  public message: Message;
  public messageSubscription: Subscription;
  public loading: boolean;
  // Form
  public form: FormGroup;
  // form options
  public estatusRecarga: any[];
  public mediosCarga: any[];
  public bancos: any[];
  public today: Date;
  public oneWeekAgo: Date;
  public idEstatusConciliadoRecarga: number;
  public idEstatusPorConciliarRecarga: number;
  // Table
  public tableInit: TableInitializer;
  public columns: Column[];
  // conciliacion - movimientos
  public aConciliar: boolean;
  public loadingMovimientos: boolean;
  public formMovimientos: FormGroup;
  public movimientosTable: TableInitializer;
  public movimientosColumns: Column[];
  public monedas: any[];
  public bancosMovimientos: any[];
  public estatusMovimientos: any[];
  public accionOptions: any[]; // opciones de conciliacion
  public seleccionAbierta: any;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder, 
    private recargasService: RecargasService,
    private bancosService: BancosService,
    private registrosService: RegistrosBancariosService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
		private entorno: EntornoService
    ) {

    this.title = 'Autorización de Recargas';
    this.loading = false;
    this.today = new Date();
    this.oneWeekAgo = new Date();
    this.oneWeekAgo.setDate(this.oneWeekAgo.getDate() - 7);

    this.form = this.formBuilder.group({
      desde: [null, [Validators.required]],
      hasta: [null, [Validators.required]],
      idEstatusRecarga: [3, [Validators.required]],
      idMedioCarga: [null],
      idBancoOrigen: [null],
      idBancoDestino: [null],
    });
    this.form.controls['desde'].setValue(this.oneWeekAgo);
    this.form.controls['hasta'].setValue(this.today);

    this.aConciliar = false;
    this.loadingMovimientos = false;
    this.formMovimientos = this.formBuilder.group({
      desde: [this.oneWeekAgo, [Validators.required]],
      hasta: [this.today, [Validators.required]],
      banco: [null, [Validators.required]],
      idEstatusMov: [1, [Validators.required]],
      referencia: [null],
      descripcion: [null]
    });
  }

  ngOnInit() {
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.consultaEstatusRecarga();
    this.consultaMediosCarga();
    this.consultaBancosActivos();
    this.consultaBancosEmpresa();
    this.definiendoTabla();
    this.onSearch();
  }

  ngOnDestroy() {
    if (this.messageSubscription != undefined) {
      this.messageSubscription.unsubscribe();
    }
  }

  consultaEstatusRecarga() {
    this.loading = true;
    this.recargasService.consultaEstatusRecarga()
    .finally( () => {
      this.loading = false;
      const concEstatus = this.estatusRecarga.find(e => e.nombre == 'conciliada');
      const porConcEstatus = this.estatusRecarga.find(e => e.nombre == 'por_conciliar');
      if (concEstatus != undefined) { this.idEstatusConciliadoRecarga = concEstatus.id }
      if (porConcEstatus != undefined) { this.idEstatusPorConciliarRecarga = porConcEstatus.id }
    })
    .subscribe( response => {
      this.estatusRecarga = response;
    })
  }

  consultaMediosCarga() {
    this.loading = true;
    this.recargasService.consultaMediosCarga()
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.mediosCarga = response;
    })
  }
  
  consultaBancosActivos() {
    this.loading = true;
    this.bancosService.getBancosActivos(1)
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.bancos = response;
    })
  }

  consultaBancosEmpresa() {
    this.loading = true;
    this.bancosService.getBancosEmpresa(1)
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.bancosMovimientos = response; // mientras no se filtren
    })
  }

  loadEstatusMov() {
    this.loadingMovimientos = true;
    this.registrosService.consultaTipoExtractosBancarios()
    .finally( () => this.loadingMovimientos = false)
    .subscribe( response => {
      this.estatusMovimientos = response;
    })
  }

  onSearch() {
    const values = this.form.value;
    let data = [];
    this.loading = true;
    this.tableInit.data = data;
    this.recargasService.consultaRecargas(
      values.desde, 
      values.hasta, 
      values.idEstatusRecarga, 
      values.idMedioCarga, 
      values.idBancoOrigen, 
      values.idBancoDestino
    )
    .finally( () => {
      this.loading = false; 
      this.tableInit.data =  data;
      if (!this.aConciliar && values.idEstatusRecarga == this.idEstatusPorConciliarRecarga) {
        // definir movimientos 
        this.loadEstatusMov();
        this.definiendoTablaMovimientos();
      }
      if (values.idEstatusRecarga == this.idEstatusPorConciliarRecarga) {
        this.aConciliar = true; 

        // generar las opciones que se pueden seleccionar para conciliar
        this.accionOptions = []
        data.forEach( d => { 
          if (d.idEstatusRecarga != this.idEstatusConciliadoRecarga) {
            this.accionOptions.push({id: d.id, alias: d.id}); 
          }
        });
      }
      // revisar accion en movimientos
      if (this.movimientosTable && this.movimientosTable.data.length > 0) {
        this.onSearchMovimientos();
      } 
    })
    .subscribe( response => {
    

      data =  this.entorno.formatearMonto(response,"monto"); 
     
    })
  }

  onFormChange(tabla: TableInitializer) {
    tabla.data = [];
 
    if (tabla.id == 'recargas') {
      this.aConciliar = false; // otras limpiezas ?
    }
  }

  onMonedaChange(event, tipo) {
    // para filtrar los bancos dependiendo del valor de la moneda
    // const nacional = event.value == 1 ? event.value : (event.value != undefined ? '0' : event.value);
    // this.consultaBancos(nacional, tipo);
  }

  onSearchMovimientos() {
    this.entorno.pivot_msg.act = false;
    let val = this.formMovimientos.value;
    let referencia = val.referencia;
    if(referencia != null){
			referencia = this.entorno.limpiarCampo(referencia.toString(),"numeros");

		}
    let descripcion = val.descripcion;
		if(descripcion != null){
			descripcion = this.entorno.limpiarCampo(descripcion.toString(),"texto-espacio");

		}
    if (descripcion !=null && 
      (descripcion.substring(0,1)==" " || descripcion.substring(descripcion.length-1,descripcion.length)==" ")){
        this.entorno.pivot_msg.act = true;
	
        this.entorno.pivot_msg.type = "alert-danger";

        this.entorno.pivot_msg.mensaje ="La descripción no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
    }else{
      this.loadingMovimientos = true;
      let data = [];
      this.movimientosTable.data = data;
      this.registrosService.consultaExtractosBancarios(
        val.desde, 
        val.hasta, 
        val.banco, 
        referencia, 
        descripcion,
        val.idEstatusMov,
      )
      .finally( () => {
        this.movimientosTable.data = data;
        this.loadingMovimientos = false;
      })
      .subscribe( response => {
        data = this.entorno.formatearMonto(response,"monto"); 
        
        // agregar recargas para conciliar a registros
        data.forEach( d => {
          d['accion'] = this.accionOptions.slice(); // slice previene asociacion por referencia
          if (d.idRecarga) {
            d['selection'] = d.idRecarga;
            d.accion.push({id: d.idRecarga, alias: d.idRecarga});
            // si tiene idRecarga deberia estar conciliado si eso cambio buscar por la propiedad de estatus
            d['selectDisabled'] = true;
          }
        })
        // console.log('extractos ', data);
      })
    }
   
  }

  openSelect(event) {
    // obtiene el valor al abrir la seleccion antes de seleccionar
    if (event.open == true) {
      const previousSelection = event.object.selection;
      this.seleccionAbierta = {previous: previousSelection, id: event.object.id};
    }
    // else { limpiar en algun lugar ?
    //   this.seleccionAbierta = undefined;
    // }
  }

  onConciliar(event) {

 
    // revisar diferentes casos
    const registroBancario = event.object;
    if ((registroBancario.selection == undefined || registroBancario.selection == null) && this.seleccionAbierta.previous == undefined) {
      // console.log('no hacer nada');
    }
    let mensaje;
    let mensajesDiferencia = '';
    let mensajeTipo;
    let idRecarga = null;
    if (registroBancario.selection != undefined && registroBancario.selection != null) {
      // revisar discrepancias
      let recargaAcomparar = this.tableInit.data.find(d => d.id == registroBancario.selection);
      idRecarga = recargaAcomparar.id;
      mensaje = this.compararExtracto(recargaAcomparar, registroBancario);
      mensajesDiferencia = mensaje.diferencia;
      mensajeTipo = mensaje.tipo;
      let mensajeIntroDif = 'Existe una discrepancia en los siguientes datos \n';
      mensajesDiferencia = mensajesDiferencia.length > 0 ? mensajeIntroDif + mensajesDiferencia : mensajesDiferencia;
    }
    if (mensaje.tipo == '' || mensaje.tipo == 'warning') {
      // Confirmar conciliacion
      this.confirmarConciliacion(registroBancario, idRecarga, mensajesDiferencia);
    }
    else {
      // Rechazar conciliacion
      this.rechazarConciliacion(mensajesDiferencia, registroBancario);
    }
  }

  compararExtracto(recargaAcomparar, seleccionComparada): any { // string - string
    let mensajesDiferencia = '';
    let type = '';
    // console.log(extractoAcomparar, seleccionComparada)
    if (recargaAcomparar.monto != seleccionComparada.monto) { 
      mensajesDiferencia = mensajesDiferencia + 'Monto: ' + 
      recargaAcomparar.monto.toString() + ' - ' + seleccionComparada.monto.toString() + '\n';
      if (type == '' || type == 'warning') { type = 'error' }
    }
    if (recargaAcomparar.idBancoDestino != seleccionComparada.idBanco) { 
      // revisar si no hay nombreCorto
      mensajesDiferencia = mensajesDiferencia + 'Banco: ' + 
      recargaAcomparar.bancoDestino.nombreCorto.toString() + ' - ' + seleccionComparada.banco.nombreCorto.toString() + '\n';
      if (type == '' || type == 'warning') { type = 'error' }
    }
    if (recargaAcomparar.referencia != seleccionComparada.referencia) { 
      mensajesDiferencia = mensajesDiferencia + 'Referencia: ' + 
      recargaAcomparar.referencia.toString() + ' - ' + seleccionComparada.referencia.toString() + '\n';
      if (type == '') { type = 'warning' }
    }
    if (recargaAcomparar.fechaRecarga != seleccionComparada.fecha) {
      mensajesDiferencia = mensajesDiferencia + 'Fecha: ' + 
      this.datePipe.transform(recargaAcomparar.fechaRecarga, 'yyyy-MM-dd') + ' - ' + 
      this.datePipe.transform(seleccionComparada.fecha, 'yyyy-MM-dd') + '\n';
      if (type == '') { type = 'warning' }
    }
    return { diferencia: mensajesDiferencia, tipo: type};
  }

  confirmarConciliacion(registroBancario, idRecarga, mensajeDiferencia) {
    let mensaje = '¿Esta seguro que desea conciliar el registro?';
    if (mensajeDiferencia != '') { mensaje = mensajeDiferencia + '\n' + mensaje}
 
    this.dialogService.showConfirmDialog('Conciliar Registro Bancario', mensaje)
    .then( option => {
      if (option === 1) {
        this.loadingMovimientos = true;
        this.recargasService.conciliarExtractoRecarga(registroBancario.id, idRecarga)
        .finally( () => {
          this.loadingMovimientos = false;
        })
        .subscribe( response => {
          // Dialogo mensaje exitoso
          this.dialogService.showCompleteDialog('Conciliación Registro Bancario', 'El Registro fue conciliado exitosamente')
          .then( result => {
            // finally reload tables
            this.onSearch();
            this.onSearchMovimientos();
          })
        },
        error => {
          // usar valor previo para restablecer
          let regBancario = this.movimientosTable.data.find(d => d.id == registroBancario.id);
          regBancario.selection = this.seleccionAbierta.previous;
        });

      }
      else {
        // usar valor previo para restablecer
        let regBancario = this.movimientosTable.data.find(d => d.id == registroBancario.id);
        regBancario.selection = this.seleccionAbierta.previous;
      }
    })
  }

  rechazarConciliacion(mensajesDiferencia, registroBancario) {
    const titulo = 'Conciliación de Registro Bancario Rechazada';
    const mensaje = mensajesDiferencia + '\n' + 'La conciliación del registro ha sido cancelada';

    this.dialogService.showCompleteDialog(titulo, mensaje)
    .then( result => {
      // usar valor previo para restablecer
      let regBancario = this.movimientosTable.data.find(d => d.id == registroBancario.id);
      regBancario.selection = this.seleccionAbierta.previous;
    });
  }

  onTableEvents(event) {
    switch (event.event) {
      case 'select':
        delete event.event;
        if (event.tableId == 'movimientos') { this.onConciliar(event); }
        else { console.log('No se consiguio la funcion de manejo para el evento')}
        break;
      
      case 'openSelect':
        delete event.event;
        if (event.tableId == 'movimientos') { this.openSelect(event); }
        else { console.log('No se consiguio la funcion de manejo para el evento')}
        break;
      
      default:
        console.log('No se consiguio la funcion de manejo para el evento')
        break;
    }
  }

  definiendoTabla() {
    const exportFilename = "AutorizacionRecargas";
    this.columns = [
      { id: 'fechaRecarga', name: 'Fecha Recarga', type: 'date', displayable: false, exportable: true,
        accesor: (element: any) => `${element.fechaRecarga}`, },
      { id: 'id', name: 'N° Recarga', type: 'default', displayable: false, exportable: true,
        accesor: (element: any) => `${element.id}`, },
      { id: 'idAfiliado', name: 'Afiliado', displayable: true, exportable: true,
        accesor: (element: any) => `${element.idAfiliado}`, type: 'default'},
      { id: 'nroTelefono', name: 'N° Telefono', displayable: false, exportable: true,
        accesor: (element: any) => `${element.nroTelefono}`, type: 'default'},
      { id: 'referencia', name: 'Referencia', displayable: true, exportable: true,
        accesor: (element: any) => `${element.referencia}`,type: 'default'},
      { id: 'medioRecarga', name: 'Medio Recarga', displayable: false, exportable: true,
        accesor: (element: any) => `${element.medioRecarga ? element.medioRecarga.nombre : ''}`,  type: 'default'},
      { id: 'bancoOrigen', name: 'Banco Origen', displayable: false, exportable: true,
        accesor: (element: any) => `${element.bancoOrigen ? element.bancoOrigen.nombreCorto : ''}`,  type: 'default'},
      { id: 'bancoDestino', name: 'Banco Destino', displayable: false, exportable: true,
        accesor: (element: any) => `${element.bancoDestino ? element.bancoDestino.nombreCorto : ''}`,  type: 'default'},
      { id: 'monto', name: 'Monto', type: 'default', displayable: false, exportable: true, 
        accesor: (element: any) => `${element.monto}`,},
      { id: 'tipoEstatusRecarga', name: 'Estado', displayable: false, exportable: true, 
        accesor: (element: any) => `${element.tipoEstatusRecarga ? element.tipoEstatusRecarga.descripcion : ''}`,type: 'default'},
    ];
    this.tableInit = {
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
      id: 'recargas',
      pageSize: 5,
    };
  }

  definiendoTablaMovimientos() {
    const fileExportName = "RegistrosBancarios";
    this.columns = [
      { id: 'fecha', name:'Fecha', type: 'date', 
        accesor: (element: any) => `${element.fecha}`, displayable: true, exportable: true },
      { id: 'banco', name:'Banco', type: 'default', 
        accesor: (element: any) => `${element.banco.nombre}`, displayable: true, exportable: true },
        { id: 'referencia', name:'Referencia', type: 'default', 
        accesor: (element: any) => `${element.referencia}`, displayable: true, exportable: true },
      { id: 'descripcion', name: 'Descripción', type: 'default',
        accesor: (element: any) => `${element.descripcion}`, displayable: true, exportable: true },
      { id: 'tipoEstatusConciliaMov', name:'Estatus', type: 'default', displayable: true, exportable: true,
        accesor: (element: any) => `${element.tipoEstatusConciliaMov ? element.tipoEstatusConciliaMov.descripcion : ''}` },
      { id: 'monto', name:'Monto', type: 'default', 
        accesor: (element: any) => `${element.monto}`, displayable: true, exportable: true },
      { id: 'mix', name: 'Conciliar', type: 'tableEvents', displayable: true, exportable: false, align: 'center', // id es mix para estilo reducido
        accesor: (element: any) => `${'select'}`},
    ];
    // extractos
    this.movimientosTable = {
      hasFooter: false,
      hasFilter: true,
      hasPagination: true,
      expandable: false,
      canChangeColumns: true,
      canExport: true,
      exportData: {filename: fileExportName, title: this.title},
      dataInputType: 0,
      data: [],
      columns: this.columns,
      id: 'movimientos',
      pageSize: 5,
    };
  }

}
