import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { CompletedDialogComponent } from "./completed-dialog/completed-dialog.component";
import { TableDialogComponent } from "./table-dialog/table-dialog.component";
import { Column } from "../table/table.service";
import { VisualizarArchivoDialogComponent } from "../../shared/dialogs/visualizar-archivo-dialog/visualizar-archivo-dialog.component"; 
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Injectable()
export class DialogService {

    constructor(
        public dialog: MatDialog
    ) { }

    /**
     * 
     * @param title Titulo
     * @param message Mensaje
     * @param yesOption Texto del Boton SI - Default: Aceptar
     * @param noOption Texto del Boton NO - Default: Cancelar
     * 
     * @return number: 1 -> si, 0 -> no, -1 -> cerrar
     */
    showConfirmDialog(title: string, message: string, yesOption?: string, noOption?: string ): Promise<number> {
        return new Promise(resolve => {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: title,
                    message: message,
                    yes: yesOption ? yesOption : 'Aceptar',
                    no: noOption ? noOption : 'Cancelar'
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                // console.log(result);
                if (result == undefined) {
                    result = -1;
                }
                resolve(result);
            });
        });
    }

    /**
     * 
     * @param title Titulo
     * @param message Mensaje
     * 
     */
    showCompleteDialog(title: string, message: string) {
        return new Promise(resolve => {
            const dialogRef = this.dialog.open(CompletedDialogComponent, {
                data: {
                    title: title,
                    message: message,
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                // console.log(result);
                if (result == undefined) {
                    result = 1;
                }
                resolve(result);
            });
        });
    }

    /**
     * 
     * @param title Titulo
     * @param message Mensaje
     * @param data Data que se muestra en la tabla
     * @param columns Columnas que definen la tabla
     * 
     */
    showTableDialog(title: string, message: string, data: any[], columns: Column[]): Promise<any> {
        return new Promise(resolve => {
            const dialogRef = this.dialog.open(TableDialogComponent, {
                data: {
                    title: title,
                    message: message,
                    dataSource: data,
                    columns: columns,
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                // console.log(result);
                resolve(result);
            });
        });
    }

    /**
     * 
     * 
     */
    showPdfDialog(title: string, message:string, recaudoObj: any, subjectsService:any)
    {
        return new Promise(resolve => 
            {
                const dialogRef = this.dialog.open(VisualizarArchivoDialogComponent, 
                    {
                        data:
                        {
                            title: title,
                            message: message,
                            recaudoObj: recaudoObj,
                            subjectsService: subjectsService
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        // console.log(result);
                        resolve(result);
                    });
            });
            
    }
}