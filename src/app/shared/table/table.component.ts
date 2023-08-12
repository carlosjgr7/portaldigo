import { Component, OnInit, Input, ViewChild, 
  AfterViewInit, Output, EventEmitter, 
  OnChanges, SimpleChanges, ChangeDetectorRef 
} from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from "@angular/material";
import { DatePipe} from "@angular/common";
import { trigger, state, style, transition, animate } from "@angular/animations";

import { SortColumnsComponent } from "./sort-columns/sort-columns.component";
import { SubStringCheckPipe } from "../pipes/subStringCheck.pipe";
import { TableService, TableInitializer, Column } from "./table.service";
import { EntornoService } from '../../entorno/entorno.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tableInit: TableInitializer;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  @Output() tableEvents = new EventEmitter();
  public dataSource = new MatTableDataSource<any>();
  public columns: Column[];
  public displayedColumns: string[];
  public exports: string[];
  public exportFilename: string;
  public title: string;
  public transactions: any[];
  public filterValues: any[];
  public totalCost: number;
  public checkedAll: boolean;
  public canExportExpandData: boolean; // de momento no se pide en tableInit

  constructor(
    private tableService: TableService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private subStringPipe: SubStringCheckPipe,
    private changeDetectorRef: ChangeDetectorRef,
		private entorno: EntornoService
  ) { }

  ngOnInit() {
    // console.log(this.tableInit);
    this.columns = this.tableInit.columns;
    this.displayedColumns = this.columns.map( c => c.id);
    this.canExportExpandData = true;
    if (this.tableInit.dataInputType === 0) {
      this.dataSource.data = this.tableInit.data;
    }
    if (this.columns.findIndex(c => c.type == 'sum') != -1) {
    // por ahora la suma tendra la limitacion de que tomara todos los campos de la data
      let column = this.columns.find(c => c.type == 'sum');
      this.transactions = this.tableInit.data.map( d => +column.accesor(d) );
      this.totalCost = this.getTotalCost();
      // console.log(this.transactions);
    }
    if (this.tableInit.canExport) {
      this.exports = this.tableInit.exportData != undefined && this.tableInit.exportData.array != undefined ? 
        this.tableInit.exportData.array : ['Copiar', 'Csv', 'Excel', 'PDF', 'Imprimir'];
      this.exportFilename = this.tableInit.exportData != undefined && this.tableInit.exportData.filename != undefined ?
        this.tableInit.exportData.filename : '';
      this.title = this.tableInit.exportData != undefined && this.tableInit.exportData.title != undefined ?
        this.tableInit.exportData.title : '';
    }
    // filterHeaders
    if (this.tableInit.filterHeaders) {     
      this.filterValues = this.tableInit.filterHeaders.map( r => {
        return { id: r.id, value: undefined};
      }); 
    }
    // this.initDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == 'tableInit') {
        let chng = changes[propName];
        if (chng.currentValue != chng.previousValue && chng.previousValue != undefined) {
          // console.log('current Value', chng.currentValue);
          this.tableInit = chng.currentValue;
          this.dataSource.data = chng.currentValue.data;
          // if para saber si hay una columna checkAll
          // if (this.tableInit.columns.findIndex( c => {c.id == 'checkAll'}) != undefined) {}
          this.checkedAll = false; // prueba
          if (this.columns.findIndex(c => c.type == 'sum') != -1) {
            // por ahora la suma tendra la limitacion de que tomara todos los campos de la data
            // se deberia tener solo una columna de tipo sum
            let column = this.columns.find(c => c.type == 'sum');
            this.transactions = this.tableInit.data.map( d => +column.accesor(d) );
            this.totalCost = this.getTotalCost();
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    this.initDataSource();
    if (this.tableInit.filterHeaders) { this.initFilterHeaders() }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initFilterHeaders() {
    // options
    this.tableInit.filterHeaders.forEach( r => { // Revisar hacer mas eficiente
      if (r.type == 'select' && r.options == undefined) {
        let option = [];
        let col = this.columns.find(c => c.id == r.id);
        // console.log('col ', col)
        this.dataSource.data.forEach( d => {
          if (!option.includes(col.accesor(d))) {
            // console.log('value ', col.accesor(d));
            option.push(col.accesor(d));
          }
        });
        if (col.type == 'date') {
          r.options = option.map(o => {
            return {value: o, nombre: this.datePipe.transform(o, 'dd/MM/yyyy')};
          });
        }
        else {
          r.options = option.map(o => {
            return {value: o, nombre: o != 'undefined' ? o : ''};
          });
        }
      }
    });
    this.changeDetectorRef.detectChanges();
    // console.log('options ', this.tableInit.filterHeaders);
  }

  initDataSource() { 
    // FilterPredicate Dinamico se guia por columns y filterExpansion
    this.dataSource.filterPredicate = (data, filter) => {
      let dataStr = '';
      Object.keys(data)
      .filter( k => {
        // console.log('k ->', k);
        if ((this.columns.findIndex(column => column.id == k && column.exportable) != -1) 
        || (this.tableInit.filterExpansion != undefined && 
          this.tableInit.filterExpansion.findIndex( expansion => expansion.filterKey == k) != -1)) {
          return true;
        }})
      .map(key => {
        if (typeof(data[key]) == 'object' && this.tableInit.filterExpansion) {
        // Agregar objetos a filterExpansion
        // suport one level of anidation
          // console.log('expansion found ', key);
          let match = this.tableInit.filterExpansion.find( e => e.filterKey == key);
          Object.keys(data[key]).map( child => {
            if ( match.admitedChildren.includes(child)) {
              // console.log(data[key][child]);
              dataStr = dataStr.concat(JSON.stringify(data[key][child]).trim().toLowerCase())
            }
          })
        }
        else {
          dataStr = dataStr.concat(JSON.stringify(data[key]).trim().toLowerCase());
          // console.log(key, ' = ', data[key]);
        }      
      });
      return dataStr.indexOf(filter) != -1; 
    }

		this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      // dynamic ??
			switch (sortHeaderId) { //static, definir cuando column.id != column.accesor o anidados
        case 'fecha': return data.fregistro;
        case 'producto': return data.producto.nombre;
        case 'clienteDoc': return data.cliente.docIdentidad;
        case 'clienteRazon': return data.cliente.nombre;
        case 'estado': return data.tipoEstatusPedido.nombre;
				default: return data[sortHeaderId];
			}
		};
  }

  applyFilter(value: string): void {
		this.dataSource.filter = value.toLowerCase();
	}

  changeColumns(): void {
		let dialogRef = this.dialog.open(SortColumnsComponent, {
			data: {
				columns: this.columns.filter((column) => column.name && column.displayable).map((column) => {
					return { id: column.id, name: column.name, selected: this.displayedColumns.includes(column.id) }
				})
			}
		});

		dialogRef.afterClosed().subscribe((result: string[]) => {
			if (result) {
        this.displayedColumns = this.columns
          .filter((column) => (result.includes(column.id) || !column.name || column.displayable == false) ).map((column) => column.id) ;
			}
		});
	}

  exportData(format): void {
    let expandToExport = this.canExportExpandData && this.tableInit.expandRows && this.tableInit.expandRows.length > 0 ? this.tableInit.expandRows : undefined;
		switch (format) {
		  case 'Excel':
			  this.tableService.exportDataToExcel(
          this.mapDataToExportByAccesor(this.dataSource.filteredData), 
          this.columns, 
          this.exportFilename, 
          expandToExport
        );
				break;
			case 'PDF':
			  let reportColumns = this.columns.filter((column) => column.name && column.exportable && this.displayedColumns.includes(column.id));
				this.tableService.exportDataToPdf(
          this.mapDataToExportByAccesor(this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort)), 
          reportColumns, 
          this.exportFilename, 
          this.title, 
          expandToExport
        );
				break;
      case 'Csv':
        this.tableService.exportDataToCsv(
          this.mapDataToExportByAccesor(this.dataSource.filteredData), 
          this.columns, 
          this.exportFilename, 
          expandToExport
        );
        break;
      case 'Copiar':
        let report = this.columns.filter((column) => column.name && column.exportable && this.displayedColumns.includes(column.id));
        // mapear expandData a report ?
        this.tableService.exportDataToClipboard(this.mapDataToExportByAccesor(this.dataSource.filteredData), report, expandToExport);
        break;
      case 'Imprimir':
        let r = this.columns.filter((column) => column.name && column.exportable && this.displayedColumns.includes(column.id));
        this.tableService.exportDataToPrint(
          this.mapDataToExportByAccesor(this.dataSource.filteredData), r, this.exportFilename, expandToExport);
        break;
    }
  }

  mapDataToExportByAccesor(data: Array<any>): Array<any> {
    return data.map( (element) => {
      let newElement = {};
      this.columns.forEach( column => {
        if (column.exportable) {
          if (column.type == 'date' && column.accesor(element) != 'undefined') {
            newElement[column.id] = this.datePipe.transform(column.accesor(element), 'dd/MM/yyyy');
          }
          else if (column.type == 'amount' && column.accesor(element) != 'undefined') {
          
            newElement[column.id] = this.entorno.pipeDecimalBigNumber(column.accesor(element).toString());
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
      // expand export
      if (this.canExportExpandData && this.tableInit.expandRows && this.tableInit.expandRows.length > 0) {
        this.tableInit.expandRows.forEach( data => {
          data.row.forEach( field => {
            const id = field.description.replace(':', '');
            newElement[id] = this.subStringPipe.transform(field.accesor(element));
          })
        })
      }
      return newElement;
    })
  }

  sortDisabled(column: Column): boolean {
    if (column.unsortable != undefined && column.unsortable != null) {
      return column.unsortable; // overrides other conditions
    }
    else {
      if (column.type == 'tableEvents') { return true; }
      // filterHeaders ?
      else { return false; }
    }
  }

  onAction(action: string, object: any) {
    //console.log('onAction inTable',{action,object});
    const event = 'action';
    this.tableEvents.emit({event, action, object, tableId: this.tableInit.id});
  }

  onTextAction(action: string, object: any) {
    //console.log('onAction inTable',{action,object});
    const event = 'text-action';
    this.tableEvents.emit({event, action, object, tableId: this.tableInit.id});
  }

  onCheck(checked, object) {
    const event = 'check';
    this.tableEvents.emit({event, checked, object, tableId: this.tableInit.id});
  }

  onSelect(object) {
    const event = 'select';
    this.tableEvents.emit({event, object, tableId: this.tableInit.id});
  }

  onOpenSelect(ev, object) {
    // funcion obtener valor seleccionado antes que cambie
    const event = 'openSelect';
    const open = ev;
    this.tableEvents.emit({event, object, open, tableId: this.tableInit.id });
  }

  onExpand(object) {
    object.expanded = !object.expanded;
    const event = 'expand';
    this.tableEvents.emit({event, object, tableId: this.tableInit.id});
  }
  
  getTotalCost() {
    let value = this.transactions.reduce((acc, value) => acc + value, 0);
    const event = 'total';
    this.tableEvents.emit({event,  value, tableId: this.tableInit.id});
    return value;
  }

  onHeaderFilter(event) {
    if (event.value == undefined) {
      this.dataSource.filter = '';
    }
    else {
      this.dataSource.filter = event.value.toString().toLowerCase();
    }
  }

  // On input focus: setup filterPredicate to only filter by input column
  setupFilter(column: Column) {
    this.dataSource.filterPredicate = (d, filter: string) => {
      const textToSearch = column.accesor(d) && column.accesor(d).toString().toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }

  getIndex(column: Column): number {
    return this.tableInit.filterHeaders.findIndex(r => r.id == column.id);
  }

  onCheckAll() {
    let objectToReturn = [];
    this.dataSource.filteredData.forEach( d => {
      if (this.checkedAll) {
        if ( d.checkDisabled == false || d.checkDisabled == undefined ) {
          d.checked = this.checkedAll;
          objectToReturn.push(d);
        }
      }
      else {
        if (d.checked) {objectToReturn.push(d);}
        d.checked = this.checkedAll;
      }
    });
    const event = 'checkAll';
    this.tableEvents.emit({event, checked: this.checkedAll, objects: objectToReturn, tableId: this.tableInit.id});
  }

}