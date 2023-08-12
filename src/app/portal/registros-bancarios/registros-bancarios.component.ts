import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { BancosService } from '../bancos/bancos.service';
import { RegistrosBancariosService } from './registros-bancarios.service';
import { Message, MessageService } from '../../shared/message/message.service';
import { DialogService } from '../../shared/dialogs/dialog.service';
import { Column, TableInitializer } from '../../shared/table/table.service';
import { EntornoService } from '../../entorno/entorno.service';

import BigNumber from "bignumber.js";

@Component({
  selector: 'app-registros-bancarios',
  templateUrl: './registros-bancarios.component.html',
  styleUrls: ['./registros-bancarios.component.scss']
})
export class RegistrosBancariosComponent implements OnInit, OnDestroy {

  public global_alert = this.entornoService.pivot_msg;

  // Basico
  public title: string;
  public loading: boolean;
  public message: Message;
  public messageSubscription: Subscription;
  public tabs: any[];
  // forms
  public today: Date;
  public oneWeekAgo: Date;
  public form: FormGroup;
  public formMasivo: FormGroup;
  public formMovimientos: FormGroup;
  // options
  public bancos: any[];
  public bancosMovimientos: any[];
  public monedas: any[];
  public estatusMovimientos: any[];
  // table
  public columns: Column[];
  public movimientosTable: TableInitializer;
  // file
  public archivo: any;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private bancosService: BancosService,
    private dialogService: DialogService,
    private registrosService: RegistrosBancariosService,
    private entornoService: EntornoService,
    ) {

    this.title = "Registro de Movimientos Bancarios";
    this.tabs = [
      {nombre: 'Registro Masivo', descripcion:'Subir un Archivo con todos los registros'},
      {nombre: 'Registro Individual', descripcion: 'Registro manual '}
    ];
    this.today = new Date();
    this.oneWeekAgo = new Date();
    this.oneWeekAgo.setDate(this.oneWeekAgo.getDate() - 7);
    this.loading = false;

    this.form = this.formBuilder.group({
      banco: [null, [Validators.required]],
      fecha: [this.today, [Validators.required]],
      referencia: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      monto: [null, [Validators.required]],//, Validators.pattern('^[0-9]+(\,[0-9]{1,2})?$')
    });

    this.formMasivo = this.formBuilder.group({
      banco: [null, [Validators.required]],
      archivo: [null, [Validators.required]],
    });

    this.formMovimientos = this.formBuilder.group({
      desde: [this.oneWeekAgo, [Validators.required]],
      hasta: [this.today, [Validators.required]],
      moneda: ['VES'],
      banco: [null, [Validators.required]],
      idEstatusMov: [1],
      referencia: [null],
      descripcion: [null]
    });
   }

  ngOnInit() {
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.loadBancos();
    this.loadMonedas();
    this.loadEstatusMov();
    this.initTable();
  }

  ngOnDestroy() {
    if (this.messageSubscription != undefined) {
      this.messageSubscription.unsubscribe();
    }
  }

  onTabChange($event) {

  }

  loadBancos() {
    this.loading = true;
    this.bancosService.getBancosEmpresa(1)
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.bancos = response;
      this.bancosMovimientos = response; // mientras no se filtre por moneda
    })
  }

  loadMonedas() {
    this.monedas = [
      {id: 1, codISO: 'VES', nombre: 'Bolivares Soberanos'},
    ];
  }

  loadEstatusMov() {
    this.loading = true;
    this.registrosService.consultaTipoExtractosBancarios()
    .finally( () => this.loading = false)
    .subscribe( response => {
      this.estatusMovimientos = response;
    })
  }

  cargarArchivo() {
    this.loading = true;
    this.registrosService.cargaMasivaExtractosBancarios(this.formMasivo.value.banco, this.archivo)
    .finally( () => this.loading = false )
    .subscribe( response => {
      // Dialogo con mensaje exitoso
      this.dialogService.showCompleteDialog('Carga Registros', 'Los Registros fueron creados exitosamente')
      .then( result => {
        this.cleanForm(this.formMasivo);
      })
    },
    error => {
      this.messageService.updateMessage({
        class: 'alert-danger',
        text: 'El Archivo presento un error de formato.'
      })
      let mensajeError = 'El Archivo a presentado los siguientes errores: \n\n';
      error.error.forEach(element => {
        mensajeError = mensajeError + element.mensaje + '\n';
      });
      this.dialogService.showCompleteDialog('Error Carga Registros', mensajeError)
      .then( result => {
        
      })
    })
  }

  uploadFile(inst: any) {
    document.getElementById(inst).click();
  }

  onFileChange(files: File[]) {
		if (files.length > 0) {
      let file = files[0];
      
      this.dialogService.showConfirmDialog('Cargar Registros', '¿Esta Seguro que desea subir el archivo ' + file.name + '?')
      .then( result => { // hacer en cargar archivo ?
        if (result === 1) {
          const division = file.name.split('.');
          const type = division[division.length-1];
          if (type.toLocaleLowerCase() == 'txt' || type.toLocaleLowerCase() == 'asc'){
            this.formMasivo.controls['archivo'].setValue(file.name);
            this.archivo = file;
          }
          else{
            this.messageService.updateMessage({class: 'alert-danger', text: 'El Documento debe tener la extension: .txt o .asc'});
          }
				}
				// this.fileInput.nativeElement.value = '';
      })
		}
  }
  limpiar(){
    let values = this.form.value;
    let monto = values.monto;
    if(monto == " "){
			monto = this.entornoService.limpiarCampo(monto.toString(),"numeros");
      return this.form.controls['monto'].setValue(monto);

    }
  }

  crearRegistro() { 


    // Confirmar subir Registro
    let values = this.form.value;
    let referencia = values.referencia;

    if(referencia != null){
			referencia = this.entornoService.limpiarCampo(referencia.toString(),"numeros");

		}
    let descripcion = values.descripcion;
		if(descripcion != null){
			descripcion = this.entornoService.limpiarCampo(descripcion.toString(),"texto-espacio");

		}
   
    if(new BigNumber("0").isGreaterThanOrEqualTo(new BigNumber(this.entornoService.limpiarMonto(values.monto).toString()))){
      this.messageService.updateMessage({class: 'alert-danger', text: 'Debe ingresar un monto mayor a cero'});

    }else  if (descripcion !=null && 
      (descripcion.substring(0,1)==" " || descripcion.substring(descripcion.length-1,descripcion.length)==" ")){
        this.entornoService.pivot_msg.act = true;
	
        this.entornoService.pivot_msg.type = "alert-danger";

        this.entornoService.pivot_msg.mensaje ="La descripción no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
    }else {
      this.entornoService.pivot_msg.mensaje ="";
      let montoRegistro = this.entornoService.limpiarMonto(values.monto.toString());

      this.dialogService.showConfirmDialog('Cargar Registro','¿Esta Seguro que desea cargar el registro?')
      .then( option => {
       
        if (option === 1) {
          this.loading = true;
      
          this.registrosService.registrarExtractoIndividual(
            values.banco, 
            referencia, 
            descripcion, 
            montoRegistro, 
            values.fecha, 
          )
          .finally( () =>  this.loading = false )
          .subscribe( response => { 
            // console.log('response Regristro ', response);
            // Dialogo mensaje exitoso
            this.dialogService.showCompleteDialog('Carga Registro', 'El Registro fue creado exitosamente')
            .then( result => {
              this.cleanForm(this.form); // con directive puede ser mejor
            })
          })
        }
      })
    }


  }

  onMonedaChange(event, tipo) {
    // para filtrar los bancos dependiendo del valor de la moneda
    // const nacional = event.value == 1 ? event.value : (event.value != undefined ? '0' : event.value);
    // this.consultaBancos(nacional, tipo);
  }

  onFormChange() {
    this.movimientosTable.data = [];
  }

  onSearch() {
    this.loading = true;
    this.entornoService.pivot_msg.act = false;
    let val = this.formMovimientos.value;
    let referencia = val.referencia;
    if(referencia != null){
			referencia = this.entornoService.limpiarCampo(referencia.toString(),"numeros");

		}
    let descripcion = val.descripcion;
		if(descripcion != null){
			descripcion = this.entornoService.limpiarCampo(descripcion.toString(),"texto-espacio");

		}
    if (descripcion !=null && 
      (descripcion.substring(0,1)==" " || descripcion.substring(descripcion.length-1,descripcion.length)==" ")){
        this.entornoService.pivot_msg.act = true;
	
        this.entornoService.pivot_msg.type = "alert-danger";

        this.entornoService.pivot_msg.mensaje ="La descripción no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";
    }else{
      this.entornoService.pivot_msg.mensaje ="";
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
        this.loading = false;
        this.movimientosTable.data = data;
      })
      .subscribe( response => {
        data = response;
        this.entornoService.formatearMonto(response,"monto"); 
        // console.log('extractos ', data);
      })
    }
  
 
  }

  cleanForm(form: FormGroup) {
    // Para Resetear Formularios de Control dentro de subcribes
    let control: AbstractControl = null;
    form.reset();
    //for preventing error color on fields
    form.markAsUntouched();
    Object.keys(form.controls).forEach((name) => {
      control = form.controls[name];
      control.setErrors(null);
    });
    // deshabilita botones con form.invalid
    form.setErrors({ 'invalid': true });
  }

  initTable() {
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
    };
  }

}
