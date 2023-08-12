import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup } from "@angular/forms";

import { Column, TableInitializer } from "../../table/table.service";

/* *******************************************************************
*  Componente de Dialog Table
*   Desarrollado por Luis Marval lmarval@fin-soft.net
*   Fecha Creado: 08/11/2019
*   Ultima Modificacion: 10/12/2019
*   Angular CLI: 8.1.0
*   Node: 12.4.0
*   Angular: 8.1.0
*********************************************************************

	Dialogo Basado en Tabla General, 
	Que tiene la opcion de generar dinamicamente un form
	el cual tiene la opcion para llamar un servicio. 
	Este debe ser configurado. 

	Para mas informacion acerca de Tabla General ir a:
		..\shared\table\table.component.documentation.txt
	Para mas informacion acerca de Form Dinamico ir a:
		..\shared\dynamic-form\dynamic-form.component.ts

	Uso: Llamar la funcion open de Mat-Dialog, pasando este componente
	pasar la data		
		title; 		-- titulo del Dialogo
		message; 	-- parrafo debajo del titulo
		columns; 	-- columnas
		dataSource 	-- En Caso de no ser byService
		questions	-- En Caso de tener un form o ser byService
		serviceCall	-- En Caso de ser ByService (se debe configurar)
		filter		-- FilterExpansion en caso de ser necesario

	Ej. byService
	let dialogTableRef = this.dialog.open( TableDialogComponent, 
      {data: {
        title: 'Clientes', 
        message: '',     
        serviceCall: 'client',
        columns: this.columnsClient, // setTableDefinitions
        questions: this.questionsClient, // setTableDefinitions
    }})

    dialogTableRef.afterClosed().subscribe( result => {
      this.form.controls['cliente'].setValue(result.object.id);
    })

*/ 
@Component({
	selector: 'app-table-dialog',
	templateUrl: 'table-dialog.component.html',
})
export class TableDialogComponent implements OnInit {
	public title: string;
	public message: string;
	public columns: Column[];
	public form: FormGroup;
	public dialogTable: TableInitializer;
	public dataTable: any[];
	public byService: boolean;
	public questions: any[];
	public serviceCall: string;
	public tipoClientes: any[];
	public filterData;
	public canAcept: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<TableDialogComponent>,
	) {
		this.title = data.title; // titulo del Dialogo
		this.message = data.message; // parrafo debajo del titulo
		this.columns = data.columns; // columnas
		this.byService = data.dataSource == undefined && data.questions ? true : false;
		this.questions = data.questions;
		this.serviceCall = data.serviceCall;
		this.dataTable = data.dataSource; // cuando tiene datos se muestra la tabla
		this.filterData = data.filter;
		this.canAcept = false;
	}

	ngOnInit() {
		if (this.byService) {
			if (this.serviceCall == 'client') {
				this.consultaTipoClientes();
			}
		}
		else {
			this.dialogTable = {
				hasFooter: false,
				hasFilter: true,
				filterExpansion: this.filterData,
				hasPagination: true,
				expandable: false,
				canChangeColumns: true,
				canExport: true,
				exportData: {filename: this.title, title: this.title},
				dataInputType: 0,
				data: this.dataTable,
				columns: this.columns,
			}
		}
	}

	onClose() {
		this.dialogRef.close();
	}
	
	// para byService:
	// https://stackoverflow.com/questions/43456415/dynamic-function-call-for-service-in-typescript 
	onSubmit(event) {
		// if (this.serviceCall == 'client') {
		// 	let id = this.tipoClientes.find( tipo => tipo.descripcion == 'Cliente').id;
		// 	this.pedidosService.loadClientsByParams(id, event.razon)
		// 	.finally( () => {
		// 		this.dialogTable = {
		// 			hasFooter: false,
		// 			hasFilter: true,
		// 			hasPagination: true,
		// 			expandable: false,
		// 			canChangeColumns: true,
		// 			canExport: true,
		// 			exportData: {filename: this.title, title: this.title},
		// 			dataInputType: 0,
		// 			data: this.dataTable,
		// 			columns: this.columns,
		// 		}
		// 	})
		// 	.subscribe( response => {
		// 		this.dataTable = response;
		// 		// console.log('client table ', this.dataTable);
		// 	});
		// }
	}

	consultaTipoClientes() {
        // this.pedidosService.loadTipoRelacionCliente()
        // .subscribe( response => {
        //     this.tipoClientes = response;
        // });
	}
	
	onTableEvents(event) {
		if (event.event == 'select') {
			this.canAcept = true;
			if ( this.dataTable.findIndex( d => d.selection != undefined) == -1) {
				this.canAcept = false;
			}
		}
		else if (event.event == 'openSelect') {
			console.log(event);
		}
		else {
			this.dialogRef.close(event);
		}
	}

	onAcept() {
		this.dialogRef.close(this.dataTable);
	}

}