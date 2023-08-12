import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { EntornoService } from '../../../entorno/entorno.service';

import { DialogService } from '../../../shared/dialogs/dialog.service';
import { LoaderService } from '../../../shared/loader/loader.service';
import { Message, MessageService } from '../../../shared/message/message.service';
import { Column, TableEvent, TableInitializer } from '../../../shared/table/table.service';
import { RolesUsuariosService } from '../roles-usuarios.service';

/** Componente para manejo de Detalle de Roles y Usuarios 
 * 
 * Recibe desde ruta parametros: Tipo {'R', 'U'} y Id {number|'crear'}
 * 
 * Se usan Promise en algunos sitios para asegurar que se tiene la data necesaria
 * 
 * Autor: Luis Carlos Marval <lmarval@fin-soft.net> */
@Component({
  selector: 'app-detalle-rol-usuario',
  templateUrl: './detalle-rol-usuario.component.html',
  styleUrls: ['./detalle-rol-usuario.component.scss']
})
export class DetalleRolUsuarioComponent implements OnInit/*, OnDestroy*/ {
  // Basic
  public title: string;
  public loading: boolean;
  public message: Message;
  public messageSubscription: Subscription;
  public tipo: string;
  public id: number;
  public form: any;
  // Options
  public opciones: any[];
  public hijos: any[];
  public tabOptions: any[];
  public acciones: any[];
  /** Objeto que contiene tablas del componente */
  public tabla: {tabs: TableInitializer, acciones: TableInitializer};
  public tiposUsuarios: any[];
  public roles: any;
  public rol : any;
  public dropdownSettings;
  public rolesSeleccionados: any[];
  public descripcionRol: string;
  public accion:any;
  public passwdReestablecida : boolean = false;
  public usuario:any;
  public global_alert = this.entornoService.pivot_msg;
  public tipoRol: number;

  public usuarioNuevo : any = {
    "usuario": "",
    "nombreCompleto": "",
    "correo": "",
    "estatus": true,
    "rol" : { "id" : "" }
  };
  
  constructor(
    private entornoService: EntornoService,
    private route : ActivatedRoute,
    private messageService: MessageService,
    private loaderService: LoaderService,
    private rolesService: RolesUsuariosService,
    private dialogService: DialogService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.accion = params['accion']
      this.tipo = params['tipo'] == 'R' || params['tipo'] == 'U' ? params['tipo'] : undefined;
      if( !isNaN(params['id']) ){ this.id = +params['id']; }
	    });
    this.title = (this.id ? 'Actualizar ' : 'Nuevo ') + ( this.tipo == 'R' ? 'Rol' : 'Usuario');
    this.loaderService.onStateChange( state => this.loading = state );
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.form = {estatus: true, nombre: null};
    this.cargarOptions().then( result => { if (this.id) { this.cargarData(); } }); 
  }

  // ngOnDestroy() {
  //   this.messageService.updateMessage(null);
  //   this.messageSubscription.unsubscribe();
  //   //this.router.navigate(['/']);
  // }

  /** Cargar Data base para selects, checks, etc.
   * 
   * Se usa un promise para tener informacion de base antes de cargar la data del rol o usuario */
  cargarOptions(): Promise<boolean> {
    return new Promise( resolve => {
      if (this.tipo == 'U') { this.cargarOpcionesUsuarios(); }
      else { this.cargarOptionsDeRoles(); }
      resolve(true);
    });
  }

  cargarOptionsDeRoles() {
    this.acciones = [];
    this.cargarOpcionesMenu().then( result => {
      if (result.length % 3 == 1) {
        result.push({nombre: 'style'});
        result.push({nombre: 'style'});
      }
      else if (result.length % 3 == 2) {
       
        result.push({nombre: 'style'});
      }
      this.opciones = result;
    });
    //this.cargarTipoUsuario();
  }

  cargarOpcionesUsuarios() {
    //this.cargarTipoUsuario();
    this.cargarRoles();
    this.rolesSeleccionados = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar Todos',
      unSelectAllText: 'Deseleccionar Todos',
      itemsShowLimit: 2,
    };
  }

  /** Llama al servicio de opcionesMenu y devuelve el response en promise
   * 
   * @returns {Promise<any[]>}  */
   cargarOpcionesMenu(): Promise<any[]> { 
    return new Promise( resolve => {
      let modulos = [];
      this.rolesService.consultaOpcionesMenu(1)
      .pipe( finalize( () => {resolve(modulos);}) )
      .subscribe( response => { 
        modulos = response;
        let hijos = modulos.filter(modulo => modulo.idPadre != undefined);
        modulos = modulos.filter(modulo => modulo.idPadre == undefined);
        hijos.forEach(hijo => {
          let padre = modulos.find(modulo => modulo.id == hijo.idPadre);
          hijo['nombrePadre'] = padre.nombre;
          hijo['idOpcionMenu'] = hijo.id;
          hijo.id = undefined;
        });
        this.hijos = hijos;
      });
    });
  }

  cargarRoles() { this.rolesService.loadRoles().subscribe( response => { console.log("roles cargados: ",response); this.roles = response; }); }

  //cargarTipoUsuario() { this.rolesService.consultaTiposUsuarios().subscribe( response => { this.tiposUsuarios = response; } )}

  /** Cargar Data de Rol o Usuario dependiendo de tipo */
  cargarData() {
    if (this.tipo == 'R') {
      this.rolesService.consultaRolPorId(this.id)
      .pipe( finalize( () => {
        if (this.opciones) {
          this.opciones.forEach( modulo => {
            modulo.checked = this.form.opcionMenuRolList.findIndex(rol => rol.idOpcionMenu == modulo.id && rol.activo) != -1;
            let serviciosCargadosParaCheckear = [];
            if (modulo.checked) {
              serviciosCargadosParaCheckear = this.form.opcionMenuRolList.find(rol => rol.idOpcionMenu == modulo.id).opcionMenuRolAccionList;
              this.onCheck(modulo.checked, modulo, serviciosCargadosParaCheckear); // revisa acciones y pone checks
            }
          });
        }
      }))
      .subscribe( response => {
        const rol = response;
        this.form = {...rol};
        this.tipoRol = rol.tipo;
        this.form.estatus = rol.estatus == 1;
      });
    }
    else {
      this.rolesService.consultaUsuario(this.id).subscribe( response => {
        const usuario = response;
        this.usuario = usuario;
        this.rol = usuario.rol.id.toString();
        this.form = {...usuario};
        this.form.estatus = usuario.estatus == 'A';
        this.descripcionRol = usuario.rol.descripcion;
        //this.rolesSeleccionados = [];
        this.rolesSeleccionados = usuario.rol;
        /*usuario.usuarioRolList.forEach(element => {
          this.rolesSeleccionados.push({...element.rol});
        });*/
        // rol - multiple selection
      });
    }
  }

  onFormChange() {

  }

  onRolChange(event: any)
  {
    let idRol = event.value;
    for(let i = 0; i< this.roles.length; i++)
    {
      if(this.roles[i].id == idRol)
      {
        this.descripcionRol = this.roles[i].descripcion
      }
    }
  }

  /** Agrega o elimina las acciones de la opcion menu que se tenga en modulo */
  onCheck(checked: boolean, modulo: any, revisarServiciosCargados?: any[]) {
    if (revisarServiciosCargados == undefined) { this.manejarOpcionMenuEnForm(checked, modulo); }
    if (checked) {
      let serviciosEnModulo = [];
      this.revisarHijosDeModuloSeleccionados(modulo);
      this.cargarOpcionesAcciones(modulo.id, revisarServiciosCargados).then( opt => {
        serviciosEnModulo = opt;
        // revisar si estan ya en servicios ?
        this.acciones = [...this.acciones, ...serviciosEnModulo];
      });
    }
    else {
      this.tabOptions = this.tabOptions.filter(tab => tab.idPadre != modulo.id);
      this.acciones = this.acciones.filter( servicio => servicio.idOpcionMenu != (modulo.idOpcionMenu || modulo.id));
    }
  }

  /** Manejo del form para opcion menu */
  manejarOpcionMenuEnForm(checked: boolean, modulo: any) {
    // se hace check y no existe opciones menu rol list
    if (checked) {
      if (this.form.opcionMenuRolList == undefined) {this.form.opcionMenuRolList = [];}
      let nuevoModulo = {...modulo};
      nuevoModulo['idOpcionMenu'] = modulo.id;
      nuevoModulo.id = undefined;
      this.form.opcionMenuRolList.push(nuevoModulo); // se agrega al form la opcion de menu
    }
    else {
      // desactivar opcionEnForm y sus acciones
      let opcionEnForm = this.form.opcionMenuRolList.find(o => o.idOpcionMenu == modulo.id);
      opcionEnForm.activo = false;
      if (opcionEnForm.opcionMenuRolAccionList) {
        opcionEnForm.opcionMenuRolAccionList.forEach(accion => { accion.activo = false; });
      }
      // desactivar y quitar check de hijos
      this.tabOptions.forEach(tab => { if (tab.idPadre == modulo.id) { this.onCheckTab(false, tab); } });
    }
  }

  /** Revisar si la opcion menu es padre de alguna pestaña y agregar a tabOptions para mostrarla */
  revisarHijosDeModuloSeleccionados(modulo: any) {
    const tieneHijos = this.hijos.findIndex(hijo => hijo.idPadre == modulo.id) != -1;
    if (tieneHijos) { 
      if (this.tabOptions == undefined) { this.tabOptions = [] }; 
      this.hijos.forEach(hijo => { if (hijo.idPadre == modulo.id) { 
        hijo.checked = this.form.opcionMenuRolList.findIndex(opcion => 
          hijo.idOpcionMenu == opcion.idOpcionMenu && opcion.activo == true) != -1;
        this.tabOptions.push(hijo); 
      } });
    }
  }

  /** Llama al servicio de opciones/acciones y devuelve el response en promise
   * 
   * @param {number} id Id de opcion de Menu
   * @param {any[]} revisarServiciosCargados Servicios que vienen de carga para poner check a acciones
   * @returns {Promise<any[]>} 
   */
   cargarOpcionesAcciones(id?: number, revisarServiciosCargados?: any[]): Promise<any[]> { 
    return new Promise( resolve => {
      let acciones = [];
      this.rolesService.consultaOpcionesAccionesDeMenu(id, 1)
      .pipe(finalize( () => { resolve(acciones); }))
      .subscribe(response => { 
        acciones = response; 
        //console.log(acciones);
        const tieneObligatorios = acciones.findIndex(accion => accion.obligatorio == true) != -1;
        // en caso de tener servicios que revisar para ponerles check
        if (revisarServiciosCargados && revisarServiciosCargados.length >= 1) {
          acciones.forEach( accion => { 
            accion.checked = revisarServiciosCargados.findIndex( c => c.idAccion == accion.idAccion && c.activo) != -1; 
          });
        }
        else if (tieneObligatorios) {
          acciones.forEach( accion => { 
            if (accion.obligatorio) {
              accion.checked = accion.obligatorio;
              this.onCheckServicio(accion.obligatorio, accion);
            }
          });
        }
      });
    });
  }

  /** Al hacer Check en opcion pestaña, se maneja similar a opcion menu */
  onCheckTab(checked: boolean, tab: any) {
    this.tabla.acciones.data = [];
    if (checked) {
      // agregar a form.opcionRolList
      this.form.opcionMenuRolList.push(tab);
      let serviciosEnModulo
      this.cargarOpcionesAcciones(tab.idOpcionMenu).then( opt => {
        serviciosEnModulo = opt;
        // revisar si estan ya en servicios ?
        this.acciones = [...this.acciones, ...serviciosEnModulo];
        const accionesSinObligatorios = this.acciones.filter(accion => accion.obligatorio != true);
        this.tabla.acciones.data = [...accionesSinObligatorios];
      });
    }
    else {
      // poner como inactivo en form
      let tabEnForm = this.form.opcionMenuRolList.find(o => o.idOpcionMenu == tab.idOpcionMenu);
      if (tabEnForm != undefined) { 
        tabEnForm.activo = false; 
        if (tabEnForm.opcionMenuRolAccionList) {
          tabEnForm.opcionMenuRolAccionList.forEach(accion => { accion.activo = false; });
        }
      }
      this.acciones = this.acciones.filter( servicio => servicio.idOpcionMenu != (tab.idOpcionMenu || tab.id));
      const accionesSinObligatorios = this.acciones.filter(accion => accion.obligatorio != true);
      setTimeout(() => { this.tabla.acciones.data = [...accionesSinObligatorios]; }, 100);
    }
  }

  /** Agrega o elimina valores al form dependiendo de los servicios seleccionados */
  onCheckServicio(checked: boolean, servicio: any) {
    // al seleccionar agregar al form
    if (checked) {
      let opcionMenu = this.form.opcionMenuRolList.find(opcion => opcion.idOpcionMenu == servicio.idOpcionMenu);
      if (opcionMenu.opcionMenuRolAccionList == undefined) { opcionMenu.opcionMenuRolAccionList = []; }
      let servicioSinId = {...servicio};
      servicioSinId.id = undefined;
      opcionMenu.opcionMenuRolAccionList.push(servicioSinId);
    }
    // al deseleccionar quitar de form
    else {
      let opcionMenu = this.form.opcionMenuRolList.find(opcion => opcion.idOpcionMenu == servicio.idOpcionMenu);
      let accion = opcionMenu.opcionMenuRolAccionList.find(accion => accion.idAccion == servicio.idAccion);
      accion.activo = false;
    }
  }

  /** Al agregar o eliminar rol, se actualiza rolesSeleccionados con el valor del evento */
  rolChange(event: any) {
    let rolesEnEvento = event;
    // revisar primero rolesSeleccionados ?
    rolesEnEvento.forEach(rol => {
      const rolServicio = this.roles.find(r => r.id == rol.id);
      rol['activo'] = rolServicio.estatus;
    });
    this.rolesSeleccionados = rolesEnEvento;
    if (this.roles != undefined) {
      this.roles.forEach( rol => {
        rol['activo'] = this.rolesSeleccionados.findIndex( r => r.id == rol.id) != -1 ? 1 : 0; 
      });
    }
  }

  /** Llamada al servicio para crear o actualizar */
  onGuardar() {
    const v = this.form;
    if (this.tipo == 'U' && this.id == undefined) {
      this.crearUsuario();
    }
    else if (this.tipo == 'U' && this.id != undefined) {
      //this.modUsuario();
    }
    else {
      const estatus = v.estatus ? 1 : 0; 
      this.rolesService.crearModificarRol(v.nombre, v.descripcion, estatus, v.idTipoUsuario, v.opcionMenuRolList, this.tipoRol, this.id)
      /*.pipe( finalize( () => { this.rolesService.rolCacheClean('rolesAccionCache').subscribe(response => console.log(response)) } ) )*/
      .subscribe( response => { this.dialogoConMensajeExitoso('Rol'); });
    }
  }

  /** Mapear metodo de columna tipo acción y regresar un string mas útil para el usuario */
  mapMetodo(metodo: string): string {
    let respuesta = '';
    if (metodo == 'GET') {respuesta = 'Consulta'} 
    else if (metodo == 'POST') { respuesta = 'Registro/Actualización'}
    else {respuesta = metodo}
    return respuesta;
  }

  /** Al emitirse un evento en la tabla se direcciona a través de esta función */
  onTableEvents(event: TableEvent) {
    if (event.event == 'check' && event.tableId == 'tabs') { this.onCheckTab(event.checked, event.object); }
    else if (event.event == 'check' && event.tableId == 'acciones') { this.onCheckServicio(event.checked, event.object); }
    else { console.error('No se ha encontrado función para manejar el evento ', event); }
  }

  /** Define las tablas usadas en tipo Rol (Tabs y Acciones) */
  definirTablasRoles(): {tabs: TableInitializer, acciones: TableInitializer} {
    const columnsTabs: Column[] = [
    { id: 'descripcionPadre', name: 'Opción de Menu', type: "default", displayable: true, exportable: true, 
      accesor: (element) => `${element.descripcionPadre}` },
    { id: 'descripcion', name: 'Pestaña', type: 'default', displayable: true, exportable: true, 
      accesor: (element) => `${element.descripcion}`},
    { id: 'checkTab', name:'', type: 'tableEvents', unsortable: true,  displayable: false, exportable: false,
      accesor: (element: any) => `${'check'}`, },
    ];
    const columnsAcciones: Column[] = [
      { id: 'accion', name: 'Módulo', type: "default", displayable: true, exportable: true, 
      accesor: (element) => `${element.accion.modulo}` },
      { id: 'descripcion', name: 'Acción', type: 'default', displayable: true, exportable: true, 
        accesor: (element) => `${element.accion.descripcion}`},
      { id: 'tipoAccion', name: 'Tipo Acción', type: 'default', displayable: true, exportable: true, 
        accesor: (element) => `${this.mapMetodo(element.accion.metodo)}`},
      // { id: 'checkAccion', name:'', type: 'tableEvents', unsortable: true,  displayable: false, exportable: false,
      //   accesor: (element: any) => `${'check'}`, config: {kind: 'check', disabledField: 'obligatorio'}},
    ];
    const tablaGeneral: TableInitializer = {
      hasFilter: false,
      hasPagination: false,
      canChangeColumns: false,
      canExport: false,
      dataInputType: 0,
      data: [],
      columns: [],
      id: '',
      expandable: false,
      hasFooter:false
    };
    let tabs: TableInitializer = {...tablaGeneral};
    tabs.columns = columnsTabs;
    tabs.id = 'tabs';
    let acciones: TableInitializer = {...tablaGeneral};
    acciones.columns = columnsAcciones;
    acciones.id = 'acciones';
    return {tabs, acciones};
  }

  /** Función que despliega dialogo de completado con mensaje exitoso
   * 
   * Dependiendo de si existe id, dice actualizar o crear.
   * 
   * @param {string} tipo valor que denota que fue completado exitosamente 'Usuario' , 'Rol' */
  dialogoConMensajeExitoso(tipo: string) {
    const mensajeExito = `El ${tipo} fue ${this.id != undefined ? 'actualizado': 'creado'} exitosamente`;
    this.dialogService.showCompleteDialog('Atención', mensajeExito).then( result => {});
  }

  /*openDialog (id : number) {

    let dialogRef = this.dialog.open(ReestablecerPasswordAdminComponent, {
      width: '450px',
      data: { id: id }
    });
    
      dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.passwdReestablecida = true;
      this.router.navigate(['/portal/usuarios']);
      });

  }*/

  crearUsuario () : void {
    this.loading=true;
    const v = this.form;
    if(this.tipo == 'U')
    {
      if (v.estatus) { 
  
        this.usuarioNuevo.estatus = "A";
  
      } else {
  
        this.usuarioNuevo.estatus = "I";
  
      }
    }
    if(v.usuario!= null){
      this.usuarioNuevo.usuario = this.entornoService.limpiarCampo(v.usuario.toString(),"texto");
  
    }
    if(v.nombreCompleto != null){
      this.usuarioNuevo.nombreCompleto= this.entornoService.limpiarCampo(v.nombreCompleto.toString(),"filtro");
  
    }
    if(v.correo != null){
      this.usuarioNuevo.correo = this.entornoService.limpiarCampo(v.correo.toString(),"correo");
  
    }
    if(this.rol != null){
      this.usuarioNuevo.rol.id = parseInt(this.rol);
    }            

    if (v.usuario == "" || v.usuario.trim() == 0) {
      this.loading=false;

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el usuario.";
    } 
    else if (v.nombreCompleto == "" || v.nombreCompleto.trim() == 0) {
      this.loading=false;

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el nombre.";

     }else if ( v.nombreCompleto!=null && 
      (v.nombreCompleto.substring(0,1)==" " || v.nombreCompleto.substring(v.nombreCompleto.length-1, v.nombreCompleto.length)==" ")){
        this.loading=false;

        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "El nombre no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";

      }  else if (v.correo == "" || v.correo.trim() == 0) {
        this.loading=false;

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el correo.";

    } else if (this.rol== "") {
      this.loading=false;

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe seleccionar el rol de usuario.";

    } else {

      this.rolesService.createUser(this.usuarioNuevo).subscribe( response  => {
        this.loading=false;

  
        this.global_alert.act = true;
        this.global_alert.type = "alert-success";
        this.global_alert.mensaje = "Usuario " + this.usuarioNuevo.usuario + " creado con exito.";

        this.entornoService.hideAlert();

        this.router.navigate(['/portal/usuarios']);

      }, error => {
        this.loading=false;

        if (error.status == 401) {

          this.entornoService.clearSession();
  
          this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'
  
          this.router.navigate(['/']);
        }

        if ( error.status == 500 ) {

          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje = "Usuario: " + this.usuario.usuario + " ya existe en la base de datos.";

          this.entornoService.hideAlert();
        } 
        else {

          this.global_alert.act = true;
          this.global_alert.type = "alert-danger";
          this.global_alert.mensaje = error.error.mensaje;

          this.entornoService.hideAlert();
        }
      });
    }
  }

  /*modUsuario () {
    const v = this.form;
    if(this.tipo == 'U')
    {
      if (v.estatus) { 
  
        this.usuario.estatus = "A";
  
      } else {
  
        this.usuario.estatus = "I";
  
      }
    }

    if(v.usuario!= null){
      this.usuario.usuario = this.entornoService.limpiarCampo(v.usuario.toString(),"texto");
  
      }
    if(v.nombreCompleto != null){
      this.usuario.nombreCompleto= this.entornoService.limpiarCampo(v.nombreCompleto.toString(),"filtro");
  
      }
    if(v.correo != null){
      this.usuario.correo = this.entornoService.limpiarCampo(v.correo.toString(),"correo");
  
      }
          

    if (v.usuario == "" || v.usuario.trim() == 0) {

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el usuario.";

    } else if (v.nombreCompleto == "" || v.nombreCompleto.trim() == 0) {

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el nombre.";

     }else if ( v.nombreCompleto!=null && 
      (v.nombreCompleto.substring(0,1)==" " || v.nombreCompleto.substring(v.nombreCompleto.length-1, v.nombreCompleto.length)==" ")){
        
        this.global_alert.act = true;
        this.global_alert.type = "alert-danger";
        this.global_alert.mensaje = "El nombre no debe contener espacios al principio ni al final, tampoco más de un espacio entre palabras. Por favor elimine el espacio del final";

      } else if (v.correo == ""  || v.usuario.trim() == 0) {

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el correo.";

      this.entornoService.hideAlert();

    } else if (this.rol == "") {

      this.global_alert.act = true;
      this.global_alert.type = "alert-danger";
      this.global_alert.mensaje = "Debe escribir el correo.";

      this.entornoService.hideAlert();

    } else {

      this.usuario.rol.id = parseInt(this.rol);

      let dialogRef = this.dialog.open(UpdateUsuarioComponent, {
        width: '450px',
        data: { usuario: this.usuario }
      });
      
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.router.navigate(['/portal/usuarios']);
        });

    }

  }*/
}

/*@Component({
	selector: 'reestablecer-password',
	templateUrl: '../../usuarios/reestablecer-password.component.html',
	providers: [
		RolesUsuariosService
	]
  })
  export class ReestablecerPasswordAdminComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<ReestablecerPasswordAdminComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private service: RolesUsuariosService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
  public loading: boolean=false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  

  restablecerPasswd ( id : number ) {

    this.loading = true;
    this.service.reestablecerPasswordAdmin( id ).subscribe( response => {
      this.loading =false;
      this.actualizado = true;

      this.mensaje_update = "Contraseña reestablecida con exito.";

    }, error => {
      console.log("error")
      this.loading =false;
      this.mensaje_update = "Error al reestablecer contraseña.";
      this.actualizado = false;
    });
  }

  
	
  
}

@Component({
	selector: 'update-usuario',
	templateUrl: '../../usuarios/update-usuario.component.html',
	providers: [
    RolesUsuariosService
		//UsuariosService
	]
  })
  export class UpdateUsuarioComponent {
  
	constructor(
	  public dialogRef: MatDialogRef<UpdateUsuarioComponent>,
	  @Inject(MAT_DIALOG_DATA) public data: any,
	  private service: RolesUsuariosService) { }
  
	public mensaje_update : string;
  
	public actualizado : boolean = false;
  public loading: boolean = false;
  
	onNoClick(): void { 
	  this.dialogRef.close();
	}
  
	update ( usuario: any ) {
    this.loading = true;

		this.service.update(usuario).subscribe( response  => {
      this.loading = false;

      this.actualizado = true;

      this.mensaje_update = "Modificacion realizada con exito.";

    }, error => {
      this.loading = false;

      this.actualizado = true;
      this.mensaje_update = error.error.mensaje;

      if (error.status == 401) {

      }

    });
  
	}
	
  
}*/
