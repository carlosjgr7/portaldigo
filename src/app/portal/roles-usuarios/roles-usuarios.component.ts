import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { EntornoService } from '../../entorno/entorno.service';

import { LoaderService } from '../../shared/loader/loader.service';
import { Message, MessageService } from '../../shared/message/message.service';
import { ActionTableEvent, Column, TableEvent, TableInitializer } from '../../shared/table/table.service';
import { RolesUsuariosService } from './roles-usuarios.service';

@Component({
    selector: 'app-roles-usuarios',
    templateUrl: './roles-usuarios.component.html',
    styleUrls: ['./roles-usuarios.component.scss']
})
export class RolesUsuariosComponent implements OnInit/*, OnDestroy*/
{
    public title: string;
    public loading: boolean;
    public message: Message;
    public messageSubscription: Subscription;
    public tabs: any[];
    public currentTabIndex: number;
    public n_usuarios : number = 0;
	  public ultimo_id : number;
    public usuarios : any = [];
    public global_alert = this.entornoService.pivot_msg;

    constructor(
        private entornoService: EntornoService,
        private messageService: MessageService,
        private loaderService: LoaderService,
        private router: Router,
        private rolesService: RolesUsuariosService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
      this.loading = true;
        this.title = 'Administración de Roles y Usuarios'
        this.loaderService.onStateChange( state => this.loading = state );
        this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
        this.tabs = [
          {nombre: 'Usuarios', descripcion: '', tipo: 'U', table: this.generarTabla('U')},
          {nombre: 'Roles', descripcion:'', tipo: 'R', table: this.generarTabla('R')}
        ];
    
        this.tabs.forEach( tab => { this.buscar(tab); }, error => {
      
			this.loading=false;

	  		if (error.status == 401) {

				this.entornoService.clearSession();

				this.entornoService.caduco_sesion = 'Su sesion ha expirado, ingrese nuevamente.'

				this.router.navigate(['/']);

			}

	    } );
        this.currentTabIndex = 0;
    }

    // ngOnDestroy() {
    //     this.messageService.updateMessage(null);
    //     this.messageSubscription.unsubscribe();
    // }

    onTabChange(event: any) {}

    buscar(tab: any) {
        let data: any = [];
        if (tab.nombre == 'Roles') {
          this.rolesService.loadRoles()
          .pipe(finalize( () => { tab.table.data = data;}))
          .subscribe( response => {this.loading=false; data = response; });
        }
        else if (tab.nombre == 'Usuarios') {
          this.rolesService.loadUsuarios()
          .pipe( finalize( () => { tab.table.data = data; }))
          .subscribe( response => 
            { 
              this.loading=false;
              data = response;
              this.usuarios = data; 
    
              this.n_usuarios = data.length;
              let temp = response.pop();
      
              this.ultimo_id = null;
              this.ultimo_id = temp.id - 1;
            });
        }
        else { this.loading=false; console.error('No se encontro función de busqueda para esta pestaña'); }
        
        
    }
    
    onCrearModificar(event?: ActionTableEvent) {
     
        const tab = this.tabs[this.currentTabIndex];
        this.router.navigate(['/portal/roles-usuarios/', tab.tipo, event ? event.object.id : 'crear', event? event.action : 'crear']);
    }

    mapearRoles(rolList: any[]): string {
    let roles = '';
    rolList.forEach((element, index) => { roles = roles + element.rol.nombre + (index != rolList.length -1 ? ', ' : ''); });
    return roles;
    }

    onTableEvents(event: TableEvent) {
    if (event.event == 'action' && event.action == 'detalle') {
        const tipo = event.tableId == 'roles' ? 'R' : 'U';
        this.router.navigate(['/portal/roles-usuarios/', tipo, event.object.id, event.action]);
    }
    else if (event.event == 'text-action' && event.action == 'modificar') {
        this.onCrearModificar(event);
    }
    else if(event.event == 'text-action' && event.action == 'eliminar') {

    }
    else { console.error('No se ha encontrado función para manejar el evento ', event); }
    }

    generarTabla(tipo: 'R' | 'U'): TableInitializer {
    const columns: Column[] = [
        { id: 'detalle', type: 'tableEvents', displayable: false, exportable: false, unsortable: true, 
        accesor: (element) => `${ element.id ? 'actions': ''}`, actions: [{state: 'detalle', icon: 'search'}]},
        { id: 'login', name: 'Usuario', type: "default", displayable: true, exportable: true, 
        accesor: (element) => `${element.usuario}` },
        { id: 'nombre', name: 'Nombre', type: 'default', displayable: true, exportable: true, 
        accesor: (element) => tipo == 'U'? `${ element.nombreCompleto}` : `${ element.nombre}`},
        { id: 'descripcion', name: 'Descripcion', type: "default", displayable: true, exportable: true, 
        accesor: (element) => `${element.descripcion}` },
        { id: 'rol', name: 'Rol', type: "default", displayable: true, exportable: true, 
        accesor: (element) => `${element.rol.nombre}` },//this.mapearRoles(element.usuarioRolList)
        { id: 'estatus', name: 'Estado', type: "default", displayable: true, exportable: true, 
        accesor: (element) => `${element.estatus}` },
        { id: 'modificar', name:'', type: 'tableEvents', unsortable: true,  displayable: false, exportable: false,
        actions: [{state: 'modificar', icon: 'Modificar'}, ], 
        accesor: (element: any) => `${'text-actions'}`, },
        { id: 'eliminar', name:'', type: 'tableEvents', unsortable: true,  displayable: false, exportable: false,
        actions: [{state: 'eliminar', icon: 'Eliminar'}, ], 
        accesor: (element: any) => `${'text-actions'}`, },
    ];
    const columnsR = columns.filter( c => c.id != 'login' && c.id != 'rol' && c.id != 'eliminar');
    const columnsU = columns.filter( c => c.id != 'descripcion');
    const tableConf: TableInitializer = {
        hasFooter:false,
        expandable: false,
        hasFilter: false,
        hasPagination: false,
        canChangeColumns: false,
        canExport: false,
        dataInputType: 0,
        data: [],
        columns: tipo == 'R' ? columnsR : columnsU,
        id: tipo == 'R' ? 'roles' : 'usuarios'
    };
    return tableConf;
    }

    refreshUsuarios ():void
    {
      this.loading = true;
      let data = [...this.tabs[0].table.data];
      this.tabs[0].table.data = [];
      let ultimo:string = null;	
		  if(this.ultimo_id != null)
      {
        ultimo =this.ultimo_id.toString();
		  }
      this.rolesService.getUsuarios(null, ultimo)
      .finally( () => this.tabs[0].table.data = data )
      .subscribe( response => {
        this.loading = false;
        let res: any = response;
        this.n_usuarios = res.length;
        if(ultimo == null)
        {
          this.n_usuarios = res.length;
          this.usuarios = [];
        }
        console.log("res => ",res)
        res.forEach( element => 
          {
            data.push(element)
          });

        if ( res.length == 0 )
        {
          this.ultimo_id = null;
	  			this.global_alert.act = true;
	  			this.global_alert.type = "alert-danger";
				  this.global_alert.mensaje = "No existen usuarios registrados.";				  
				  this.entornoService.hideAlert();
        }
        else
        {
          let temp = res[res.length-1];
          console.log("temp => ",temp)	
	  		  this.ultimo_id = null;
          this.ultimo_id = temp.id;
        }
        
      });
      /*this.rolesService.getUsuarios(null, ultimo).subscribe( response => {

			this.loading = true;

	  		
			let res: any = response;
			
			
			this.n_usuarios = res.length;

			

			if(ultimo == null){
				this.n_usuarios = res.length;
				this.usuarios = [];
			}
      
			for ( var i = 0; i < res.length; i ++ ) {

        
				this.usuarios.push( res[i] );

			}
		
	  		if ( this.usuarios.lenght == 0 ) {
				this.ultimo_id = null;
	  			this.global_alert.act = true;
	  			this.global_alert.type = "alert-danger";
				this.global_alert.mensaje = "No existen usuarios registrados.";
				  
				  this.entornoService.hideAlert();

				  this.loading = false;

	  		} else {
				if(res.lenght > 0){
					let temp = res.pop();
		

					this.ultimo_id = null;
		
					this.ultimo_id = temp.id;	
				}
					  
				  this.loading = false;

	  		}

		  }, error => {} );
		  
		  this.loading = false;*/
	  }

    verMas () 
    {
      this.loading = true;
      let data = [...this.tabs[0].table.data];
      this.tabs[0].table.data = [];
      this.rolesService.getUsuarios(null, this.ultimo_id.toString())
      .finally( () => this.tabs[0].table.data = data )
      .subscribe( response => {
        this.loading = false;
        let res: any = response;
        res.forEach( element => {data.push(element)});
        let temp = res.pop();	
        if(res.length < 25)
        {
          this.n_usuarios = null;
        }
        else
        {         
	  		  this.ultimo_id = null;
          this.ultimo_id = temp.id;
        }
      });
    }

    /*openDialogEliminar( id:number, usuario:string ): void {
      console.log("id del usuario a borrar ",id)
      console.log("usuario a borrar",usuario)
		console.log(id)
		if(id == this.ultimo_id){
			this.ultimo_id = this.ultimo_id - 1;
		}
	    let dialogRef = this.dialog.open(DeleteUsuarios, {
	      width: '450px',
	      data: { id: id, usuario: usuario }
	    });

	    dialogRef.afterClosed().subscribe(result => {
      console.log("respuesta => ",result.respuesta)
			if(result.respuesta == true){
				// for ( var i = 0; i < this.usuarios.length; i ++ )
        for ( var i = 0; i < this.tabs[0].table.data.length; i ++ )
        {
					if ( this.tabs[0].table.data[i].id == id) 
          {
            this.usuarios.splice(i, 1);
            this.tabs[0].table.data.splice(i, 1);
					}	
				}
        this.refreshUsuarios();				
			}
	    	
	      console.log('The dialog was closed');
	    });
	  }*/
}

/*@Component({
    selector: 'delete-usuarios',
    templateUrl: '../usuarios/delete-usuarios.component.html',
    providers: [
        //UsuariosService
    ]
  })
  export class DeleteUsuarios {
  
    constructor(
      public dialogRef: MatDialogRef<DeleteUsuarios>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private service: RolesUsuariosService,
      private entornoService: EntornoService, 
      private router: Router,
      private ref: ChangeDetectorRef) { }
  
    public mensaje_delete : string;
  
    public borrado : boolean = false;
    public loading: boolean = false;
    public respuestaOk: boolean = false;
  
    onNoClick(): void {this.dialogRef.close({respuesta:this.respuestaOk});}
  
    borrar ( id:number, usuario:string ) : void {
      this.loading =true;
      
        this.service.borrar(id).subscribe( response => {
  
            if ( response.status ) {
                  this.respuestaOk = true;
                  this.borrado = true;
  
                    this.mensaje_delete = "Usuario: " + usuario + " ha sido eliminado con exito.";
  
                    this.entornoService.pivot_msg.act = false;
  
              }
              this.loading =false;
  
        }, error => {
          this.borrado = true;
          this.respuestaOk = false;
  
          this.loading =false;
  
  
          if (error.error.mensaje) {
              this.mensaje_delete = error.error.mensaje;
          }
        } );
  
    }
  
  }*/