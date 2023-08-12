import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatSort, MatPaginator, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subscription } from "rxjs";

import { Column } from "../../../shared/table/table.service";
import { Message, MessageService } from "../../../shared/message/message.service";
import { AfiliadosService } from "../../afiliados/afiliados.service";

@Component({
    selector: 'dialog-afiliado',
    templateUrl: 'dialog-afiliado.html',
})
export class DialogAfiliado implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<any>();
  public columns: Column[] = [
		{ id: 'identificacion', name: 'Identificación', displayable: true, exportable: true },
		{ id: 'nombrecompleto', name: 'Nombre Completo', displayable: true, exportable: true },
		{ id: 'actions', displayable: true, exportable: false }
	];
  public displayedColumns: string[] = ['identificacion', 'nombrecompleto', 'actions'];
  public tipoPersona : string;
  
  public message: Message;
  public messageSubscription: Subscription;
  public razon: string;
  public showTable: boolean;

  
  constructor(
    public dialog: MatDialogRef<DialogAfiliado>,
    @Inject(MAT_DIALOG_DATA) public data : DialogAfiliado,
    private afiliadosService : AfiliadosService,
    private messageService : MessageService
    ) {}
  
  ngOnInit(){
    this.dialog.disableClose = true;
    this.messageSubscription = this.messageService.message.subscribe(data => this.message = data);
    this.initDataSource();
    this.showTable = false;

  }

  ngAfterViewInit() {
  
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  } 

  buscar() {
    this.afiliadosService.getAfiliados(this.data.tipoPersona, this.razon)
    .finally( () => this.showTable = true )
    .subscribe( (response:any) => {
      this.dataSource.data = response;
    });
  }


  onIdAfiliado(element){    
    this.dialog.close({id : element.id, nombre : element.identificacion})    
  }

  noPermitirEspacio(event) : void {
 
    if(event.code == "Space") {
      event.preventDefault();
    }else if((new RegExp(/^[A-Za-z]+$/gi).test(event.key.toString())) == false){
      event.preventDefault();
    }
  }
  
  initDataSource() {


    this.dataSource.filterPredicate = (data: any, filter: string) => {

      let dataFilter : string = '';
      for(let column in data){
                
        if(data[column] != undefined && column != 'id'){
          if(column == 'identificacion'){
            dataFilter = dataFilter +' '+ data[column];
          }      
          if(column == 'nombreCompleto'){
            dataFilter = dataFilter +' '+ data[column];
          }      
        }

      }
      
      return (dataFilter.toLowerCase().indexOf(filter) !== -1 );     
    } 

  	this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
  		switch (sortHeaderId) {
        case 'identificacion' : return data.identificacion;
        case 'nombrecompleto': return data.nombreCompleto;
  			default: return data[sortHeaderId];
  		}
  	};
  }

  onClose() {
    this.dialog.close();
  }
}