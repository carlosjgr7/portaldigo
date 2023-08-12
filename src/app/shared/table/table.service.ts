import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExportToCsv } from 'export-to-csv';

import { ExcelService } from "../../excel/excel.service";

/** 
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface usada por Column para definir la forma de las acciones
 * 
 * @property {string} state - Estado para validar, luego de emitir evento
 * @property {string} icon - Icono usado para boton
 * @property {string} color - (opcional) - color para sobre escribir primary
*/
export interface actionsData {
	state: string,
	icon: string,
	color?: string,
	// tooltip
}

/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface para definir estructura de Columnas de tablas,
 * se puede usar tanto para la tabla dinamica como para tablas manuales.
 * @example Ejemplo de Columna para Tabla Dinamica
 * { id: 'id', name: 'N° Orden', type: 'default', displayable: false, exportable: true, 
 *  accesor: (element: any) => `${element.id}`, }
 * 
 * @property {string} id - Identificador de la columna, se usa para mapear displayColumn,
 * si se tiene accesor se recomienda que el id sea igual al accesor.
 * Esto es util para filtros y otras funcionalidades de la tabla.
 * @property {string} name - (opcional) - Se muestra en el header de la tabla, default es "".
 * @property {boolean} displayable - (opcional) - Determina si se puede ocultar en SortColumn, 
 * default es undefined, puede generar error si no se tiene con el ChangeColumns.
 * @property {boolean} exportable - (opcional) - Determina si la columna se muestra en los documentos
 * exportados.
 * @property {Function} accesor - (opcional) - 
 * Funcion que dado un elemento de la data extrae el string correspondiente al valor del objeto.
 * @example Ejemplos de Funcion accesor
 * (element: any) => `${element.idRetiro}`
 * (element: any) => `${element.retiro ? element.retiro.referencia: ''}`
 * @property {string} type - (opcional) - Tipo que predefine pipes y estilos. 
 * Tipos existentes: "default", "date", "amount", "tableEvents", "sum", "footerCol", "expandable"
 * @property {string} footer - (opcional) - En caso de ser de tipo "footerCol", 
 * esta propiedad es lo que se muetra en el footer de esa columna.
 * @property {actionsData[]} actions - (opcional) - En caso de ser de tipo "tableEvents", 
 * especificamente siendo una accion (boton en la tabla que regresa un evento al hacer click).
 * @see {@link actionsData}
 * @property {string} align - (opcional) - En caso de ser de algun tipo que tiene una alineacion,
 * esta propiedad tiene precedencia y sobre escribe esa alineacion.
 * @property {boolean} boldHeader - (opcional) - Pone el name de la columna en negrita. default es false
 * @property {boolean} unsortable - (opcional) - Controla el MatSort, 
 * el default es false, exceptuando para el tipo "tableEvents".
 */
export interface Column {
	id: string;
	name?: string;
	displayable?: boolean;
	exportable?: boolean;
	accesor?: Function;
	type?: string;
	footer?: string;
	actions?: actionsData[];
	align?: string;
	boldHeader?: boolean;
	unsortable?: boolean;
	}

/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface para la Data que configura el export de la tabla
 * 
 * @property {string} filename - (opcional) - Nombre que se le da al archivo que se descargara. Default ""
 * @property {string} title - (opcional) - Titulo que aparece en PDF e Impresion. Default ""
 * @property {string[]} array - (opcional) - Arreglo de strings que seran los export, 
 * en caso de definir nuevos debe hacerse la funcion para su manejo.
 * Default ['Copiar', 'Csv', 'Excel', 'PDF', 'Imprimir']
 */
export interface ExportData {
	filename?: string,
	title?: string,
	array?: string[]
}
  
/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface que define las filas de la expansion de la tabla.
 * 
 * @property {string} title - Titulo de la fila, se muestra en negrita y se le agrega ":", 
 * Si no se quiere titulo se define con "" y eso lo eliminara.
 * @property {ExpandData[]} row - Filas de la data de expansion, cada elemento del arreglo sera una fila.
 */
export interface ExpandRow {
	title: string,
	row: ExpandData[], 
}
  
/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface que define la Data de la fila de una expansion.
 * Usada en ExpandRow.
 * 
 * @property {string} description - Descipcion del valor
 * @property {(element: any) => string} accesor - Funcion que accede al objeto
 *  donde se encuentra y regresa el valor que se muestra en la expansion.
 */
export interface ExpandData {
	description: string,
	accesor: (element: any) => string,
}
  
/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface usada por Tabla en FilterExpansion. 
 * Al tener un error de filtro en que un objeto con anidacion compleja 
 * no es encontrado por el filtro, se puede definir la data del filtro.
 * 
 * @property {string} filterKey - 
 * @property {string[]} admitedChildren - (opcional) -
 */
export interface filterData {
	filterKey: string,
	admitedChildren?: string[],
}
  
/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface usada por Tabla en FilterHeaders.
 * Define que columnas tienen un filtro en su header. Y la forma en que se filtra.
 * 
 * @property {string} id - Identificacion de la columna que tendra filtro
 * @property {string} type - Tipo de filtro aplicado, se tienen "select" y "input"
 * @property {any[]} options - (opcional) - En caso de ser de tipo "select", 
 * se puede proveer las opciones de la seleccion, 
 * al no dar esta propiedad se calcularia con la data de la columna de la tabla,
 * esto tiene lugar en ngAfterViewInit para mejorar eficiencia.
 */
export interface filterHeader {
	id: string,
	type: string, // 'select', 'input'
	options?: any[],
}

/**
 * Tipo que define estructura de eventos de la tabla.
 * 
 * Autor: Luis Marval <lmarval@fin-soft.net> */
 export type TableEvent = | CommonTableEvent | ActionTableEvent | CheckTableEvent | 
 CheckAllTableEvent | SelectAllTableEvent | ValueTableEvent | HeaderFilterTableEvent |
 ExpandTableEvent | ExportTableEvent;

 /** Interface para tipo común para eventos 'select' y 'input' */
export interface CommonTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'select' | 'input',
	/** Objeto de la data en el cual ocurrio el evento */
	object: any,
	/** Id de la columna donde ocurrio el evento */
	columnId: string,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de eventos accion 'action' y 'text'action' */
export interface ActionTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'action' | 'text-action',
	/** Acción definida en ActionsData por propiedad state */
	action: string,
	/** Objeto de la data en el cual ocurrio el evento */
	object: any,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de eventos check */
export interface CheckTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'check',
	/** Si se selecciono o desdelecciono el check */
	checked: boolean,
	/** Objeto de la data en el cual ocurrio el evento */
	object: any,
	/** Id de la columna donde ocurrio el evento */
	columnId: string,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de evento checkAll */
export interface CheckAllTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'checkAll',
	/** Si se selecciono o desdelecciono el check-all, en caso de tener un error devuelve ese string */
	checked: boolean|string,
	/** Objetos de la data en los cuales ocurrio el evento */
	objects: any[],
	/** Id de la columna donde ocurrio el evento */
	columnId: string,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de evento selectAll */
export interface SelectAllTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'selectAll',
	/** Valor seleccionado en header de columna */
	select: any,
	/** Id de la columna donde ocurrio el evento */
	columnId: string,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de evento por valor 'total' y 'pagination' */
export interface ValueTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'total' | 'pagination',
	/** **Caso Total:** Valor resultante del calculo de total debe ser número. 
	 * 
	 * **Caso Paginación:** Objeto con los valores de control de la paginación. */
	value: any|number,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de evento header-filter */
export interface HeaderFilterTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'header-filter',
	/** Valor que se paso al filtro de cabecera */
	value: any,
	/** Id de la columna donde ocurrio el evento */
	columnId: string,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de evento expand */
export interface ExpandTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'expand',
	/** Objeto de la data en el cual ocurrio el evento */
	object: any,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

/** Interface para tipo de evento export */
export interface ExportTableEvent {
	/** Nombre del tipo de evento que se emite */
	event: 'export',
	/** Formato en el que se desea exportar */
	format: string,
	/** Data de expansion que debe estar en documento */
	expandToExport: ExpandRow[]|undefined,
	/** Id de la tabla en caso de que no se defina la propiedad id de la tabla retorna undefined */
	tableId: string,
}

export interface paginatorConfig {
	/** Cantidad de elementos en los que se dividen las paginas */
	pageSize: number,
	/** Cantidad de elementos */
	length: number,
	/** Indice de la pagina en la que se encuentra  */
	pageIndex: number,
	/** Indice de la pagina anterior a la que se encuentra, agregado por el evento de pagination  */
	previousPageIndex?: number
}

  
/**
 * @author Luis Marval <lmarval@fin-soft.net>
 * @description Interface que define las propiedades de la Tabla.
 * @example Ejemplo de TableInitializer
 *   this.randomTable = {
    hasFooter: false,
    hasFilter: true,
    hasPagination: true,
    expandable: false,
    canChangeColumns: true,
    canExport: true,
    exportData: {filename: 'PruebaTabla', title: 'Prueba Tabla'},
    dataInputType: 0,
    data: this.dataTest,
	columns: this.columns,
	id: 'randomTable',
  }
 * 
 * Para ejemplos de propiedades en particular puede querer consultar el link pertinente
 * @property {boolean} hasFooter - Define si se tiene Footer, 
 * lo que se muestra en el footer depende de las columnas.
 * @property {boolean} hasFilter - Define si se tiene un campo de filtro arriba de la tabla.
 * @property {boolean} hasPagination - Define si se tiene paginacion.
 * @property {boolean} expandable - Define si la tabla es expandible.
 * @property {boolean} canChangeColumns - Define si se tiene boton que permite ocultar columnas,
 * que columnas se pueden ocultar depende de las columnas.
 * @property {boolean} canExport - Define si se puede exportar, muestra botones con los formatos de archivos.
 * @property {ExportData} exportData - (opcional) - Configura formatos que se muestran, nombre de archivo y titulo. 
 * Para exportar la data de la tabla, la data que se exporta depende de las columnas.
 * @see {@link ExportData}
 * @property {filterData[]} filterExpansion - (opcional) - Define una expansion de filtro, 
 * la que se usa cuando se tiene un error en los filtros.
 * @see {@link filterData}
 * @property {filterHeader[]} filterHeaders - (opcional) - Define Filtros de diferentes tipos en los header especificados de la tabla,
 * Se recomienda que hasFilter sea false.
 * @see {@link filterHeader}
 * @property {ExpandRow} expandRows - (opcional) - Define las filas de expansion, la tabla debe ser expandable
 * @see {@link ExpandRow}
 * @property {number} dataInputType - Define la forma en que se le pasa la data a la tabla.
 * De momento solo esta implementado 0: data, se pasa la data{any[]} a la propiedad data.
 * @property {any[]} data - (opcional) - Define la data que se muestra en la tabla.
 * Se recomienda inicializar en [] y tener condiciones para que los cambios se vean correctamente.
 * @property {Column[]} columns - Define las columnas de la tabla. Las cuales definen varios comportamientos de la tabla.
 * @see {@link Column}
 * @property {string} id - (opcional) - Define el Identificador de la tabla, el cual es retornado por los eventos.
 * @property {checkAllDisabled} boolean - (opcional) - Si se tiene una columna para el checkAll, esta propiedad deshabilita el check del header.
 * Default es false.
 * @property {number} pageSize - (opcional) - Si se tiene pagination, Define el tamaño de las paginas. Default es 10.
 */
export interface TableInitializer {
	hasFooter: boolean,            
	hasFilter: boolean,//            
	hasPagination: boolean,  //      
	expandable: boolean,           
	canChangeColumns: boolean,  //   
	canExport: boolean,          //  
	exportData?: ExportData,  //
	filterExpansion?: filterData[],//
	filterHeaders?: filterHeader[],
	expandRows?: ExpandRow[],     
	dataInputType: number, //
	data?: any[],//
	columns: Column[],//
	id?: string,//
	checkAllDisabled?: boolean,
	pageSize?: number,
	paginationConfig?: paginatorConfig
}

@Injectable()
export class TableService {

	private states: Map<string, any> = new Map<string, any>();
	private projectName = 'DigoPago';

	constructor(
		private datePipe: DatePipe,
		private excelService: ExcelService
	) { }

	exportDataToExcel(data: any[], columns: Column[], filename: string, expandData?: ExpandRow[]): void {
		let rows = data.map((element) => {
			let row: any = {};

			columns.filter((column) => column.exportable).forEach((column) => {
				row[column.name] = element[column.id];
			})

			if (expandData) {
				expandData.forEach( data => {
					data.row.forEach( field => {
						const id = field.description.replace(':','');
						row[id] = element[id];
					})
				})
			}

			return row;
		});

		this.excelService.exportAsExcelFile(rows,null, filename);
	}

	exportDataToPdf(data: any[], columns: Column[], filename: string, title: string, expandData?: ExpandRow[]): void {
		let columnNames = columns.map((column) => column.name);

		let rows = data.map((node) => {
			let row: any = [];

			columns.forEach((column, index) => {
				row[index] = node[column.id];
			});

			if (expandData) {
				let extraRows = []
				expandData.forEach( data => {
					let extraRow = []
					if (data.title != '') {
						const title = data.title +':';
						extraRow.push(title);
					}
					data.row.forEach( column => {
						const id = column.description.replace(':','')
						extraRow.push(column.description + node[id]);
					});
					extraRows.push(extraRow);
				});

				return {row, extraRows}
			}

			return row;
		});
		if (expandData) {
			let auxRow = [];
			rows.forEach( compound => {
				auxRow.push(compound.row);
				compound.extraRows.forEach(extra => {
					auxRow.push(extra);
				});
			})
			rows = auxRow;
		}

		let doc = new jsPDF('landscape', 'mm', 'legal');

		let header = this.projectName + ' > ' + title + ' (' + this.datePipe.transform(Date.now(), 'dd/MM/yyyy hh:mmaa') + ')';

		doc.autoTable({
			head: [columnNames], 
			body: rows, 
			headStyles: { fillColor: '#262262'}, 	// changes table header color
			didDrawPage: function () { 				// adds header to top of file
			 	doc.text(header, 5, 10);
			},
		});

		doc.save(filename + '.pdf');
	}

	exportDataToCsv(data: any[], columns: Column[], filename: string, expandData?: ExpandRow[]): void  {
		let rows = data.map((element) => {
			let row: any = {};

			columns.filter((column) => column.exportable).forEach((column) => {
				row[column.name] = element[column.id];
			})

			if (expandData) {
				expandData.forEach( data => {
					data.row.forEach( field => {
						const id = field.description.replace(':','');
						row[id] = element[id];
					})
				})
			}

			return row;
		});
		   
		const options = {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalSeparator: '.',
			showLabels: true,
			showTitle: true,
			title: filename,
			filename: filename,
			useTextFile: false,
			useBom: true,
			useKeysAsHeaders: true,
			// headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
		};

		const csvExporter = new ExportToCsv(options);

		csvExporter.generateCsv(rows);
	}

	exportDataToClipboard(data: any[], columns: Column[], expandData?: ExpandRow[]) {
		let columnNames = columns.map((column) => column.name).toString().replace(/,/g, '\t');
		if (expandData) {
			let expandNames = '';//expandData.map( (field) => field.description.replace(':','')).toString().replace(/,/g, '\t');
			expandData.forEach( data => {
				data.row.forEach( field => {
					expandNames = expandNames + field.description.replace(':','').toString()  + '\t';
				});
			});
			columnNames = columnNames.concat('\t', expandNames);
		}
		let rows = data.map((node) => {
			let row: any = [];
			columns.forEach((column, index) => {
				row[index] = node[column.id];
			});
			if (expandData) {
				expandData.forEach( data => {
					data.row.forEach( field => {
						const id = field.description.replace(':','');
						row.push(node[id]);
					})
				})
			}
			return row;
		});

		let output = rows.map( row => (row.toString()).replace(/,/g, '\t') + '\n')
		document.addEventListener('copy', (e: ClipboardEvent) => {
			e.clipboardData.setData('text/plain', (columnNames + '\n' + output.toString().replace(/,/g, '')));
			e.preventDefault();
			document.removeEventListener('copy', null);
		});
		document.execCommand('copy');
	}

	exportDataToPrint(data: any[], columns: Column[], fileName: string, expandData?: ExpandRow[]) {
		// Otras opciones de manejo
		// https://www.npmjs.com/package/ng2-pdf-viewer
		// generar pdf y verlo en viewer?
		// https://stackoverflow.com/questions/44244148/how-to-print-pdf-in-angular-2
		// hacer un frame y imprimir
		// puede ser una mezcla de lo que se hace y los anteriores. 
		// https://stackoverflow.com/questions/16894683/how-to-print-html-content-on-click-of-a-button-but-not-the-page

		let w=window.open();
        let header = this.projectName + ' > ' + fileName + ' (' + this.datePipe.transform(Date.now(), 'dd/MM/yyyy hh:mmaa') + ')';
        w.document.write(
        `<head>
          <style>
            * {
              -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
              color-adjust: exact !important;  /*Firefox*/
            }
            table {
				overflow: auto;
				border-collapse: collapse;
				min-width: 100%;
			}
			.expand-row {
				background: #FEFEFE !important;
			}
            th {
              padding-left: 15px; 
              padding-rigth: 15px;
              background: #262262; /* color for table header */
              color: white; 
            }
            td {
              padding-left: 15px; 
              padding-rigth: 15px;
              font-familly: sans-serif;
              color: #50576A;
			  font-size: 14px;
			  background: #F1F1F1; 
			  text-align: center;
            }
          </style>
        </head>`)
        w.document.write('<h3>' + header + '<\/h3>');
        w.document.write('<table>');
        w.document.write('<tr>');
        columns.forEach( column => {
          w.document.write('<th><b>' + column.name + '</b><\/th>');
        });
        w.document.write('<\/tr>');
        data.map((node) => {
          w.document.write('<tr>');
          columns.forEach(column => {
            // row[index] = node[column.id];
            w.document.write('<td>' + node[column.id] + '<\/td>');
          });
		  w.document.write('<\/tr>');
		  // expand row
		  if (expandData != undefined) {
			expandData.forEach(data => {
				w.document.write('<tr>');
				w.document.write('<td class="expand-row"><strong>' + data.title + ':' + '<\/strong><\/td>');
				data.row.forEach( field => {
					const id = field.description.replace(':','');
					w.document.write('<td class="expand-row">' + field.description + node[id] + '<\/td>');
				})
				w.document.write('<\/tr>');
			});
		  }
        })
        w.document.write('<\/table>');
        w.print();
        w.close();
	}

	loadState(key: string): any {
		return this.states.get(key);
	}

	saveState(key: string, state: any): void {
		this.states.set(key, state);
	}

}