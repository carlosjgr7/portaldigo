import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { EntornoService } from "../../../entorno/entorno.service";
import { AfiliadosService } from "../../../portal/afiliados/afiliados.service";
import { UpdateAfiliadosComponent } from "../../../portal/afiliados/detalles.component";
import { SubjectsService } from "../../subjects/subjects";
import { VisualizarArchivoDialogComponent } from "../visualizar-archivo-dialog/visualizar-archivo-dialog.component";

@Component({
	selector: 'lista-recaudos-dialog',
	templateUrl: 'lista-recaudos-dialog.component.html',
})

export class ListaRecaudosDialogComponent
{
    public id: number
    public title: string;
    public yesOption: string;
    public noOption: string;
    public width: string;
    public height: string;
    public recaudos: any[];

    constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private subjectsService: SubjectsService,
        public dialogRef: MatDialogRef<ListaRecaudosDialogComponent>
    )
    {
      dialogRef.disableClose = true;
      this.id = data.id
      this.title = data.title;
      this.yesOption = data.guardar;
      this.noOption = data.volver;
      this.recaudos = data.recaudos;
    }

    onClick(option: number) 
    {
      console.log(this.recaudos)
      if(option == 1)
      {
        console.log(this.id)
        let dialogRef = this.dialog.open(UpdateRecaudosComponent, {
          width: '450px',
          data: { 
            id: this.id,
            recaudos: this.recaudos,
            loading: true
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(result)
          console.log('The dialog was closed');
          if(result == 0)
          {
            this.dialogRef.close(this.recaudos);
          }
          else
          {
            for(let i = 0; i < this.recaudos.length; i++)
            {
              this.recaudos[i].cambiado = false;
              if(this.recaudos[i].enterado && this.recaudos[i].archivo != undefined)
              {
                this.recaudos[i].enterado = false;
              }
              else if( !this.recaudos[i].enterado && this.recaudos[i].archivo != undefined)
              {
                this.recaudos[i].enterado = true;
              }
            }
          }
          
        });
       
      }
      else
      {
        for(let i = 0; i < this.recaudos.length; i++)
        {
          if(this.recaudos[i].cambiado)
          {
            if(this.recaudos[i].enterado)
            {
              this.recaudos[i].enterado = false;
            }
            else
            {
              this.recaudos[i].enterado = true;
            }
          }
        }
        this.dialogRef.close(null);
      }
    }

    actualizarCambio(recaudo:any)
    {
      recaudo.cambiado = true;
    }
    //
    visualizarArchivo(index:number): void 
    {
      let isImg;

      if(this.recaudos[index].archivo.substr(this.recaudos[index].archivo.length - 3) == 'pdf')
      {
        isImg = false;
      }
      else if(this.recaudos[index].archivo.substr(this.recaudos[index].archivo.length - 3) == 'jpg' || this.recaudos[index].archivo.substr(this.recaudos[index].archivo.length - 4) == 'jpeg' || this.recaudos[index].archivo.substr(this.recaudos[index].archivo.length - 3) == 'png' )
      {
        isImg = true;
      }
      this.dialog.open(VisualizarArchivoDialogComponent,
      {
        data:
        {
          title: 'Visualizar recaudo - '+this.recaudos[index].tipoDocumento,
          message: this.recaudos[index].archivo,
          recaudoObj: this.recaudos[index].recaudoObj,
          subjectsService: this.subjectsService,
          isImg: isImg
        },
        width: '450px'
      })
      .afterClosed().subscribe((option:string) =>
      {
        if(option == 'Validar')
        {
          this.recaudos[index].enterado = true;
        }
      });
    }
}

@Component({
  selector: 'update-recaudos',
  templateUrl: './lista-recaudos-confirm-dialog.component.html',
  providers: [
  	AfiliadosService
  ]
})
export class UpdateRecaudosComponent
{
  constructor(
    public dialogRef: MatDialogRef<UpdateAfiliadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entornoService: EntornoService,
    private service: AfiliadosService) { 
      
      this.dialogRef.disableClose = true;
    }

  public mensaje_update : string;

  public actualizado : boolean = false;

  public error: boolean = false;

  public loading : boolean = false;

  onNoClick(value: number): void { 
    this.dialogRef.close(value);
  }

  update ( id:number, recaudos: any[] ) 
  {
    this.service.guardarCambioEnRecaudos(id, recaudos).subscribe( result => 
    {
        this.mensaje_update = "Recaudos modificados con éxito.";

        this.actualizado = true;
        
        this.loading = false;
        
    }, error => 
    {
      this.actualizado = true;
      this.error = true;
      this.loading = false;
      if (error.error.mensaje) 
      {
        this.mensaje_update = error.error.mensaje;
      }
    });

  }
}