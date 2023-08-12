import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: 'visualizar-archivo-dialog',
	templateUrl: 'visualizar-archivo-dialog.component.html',
})

export class VisualizarArchivoDialogComponent
{
    public title: string;
	public message: string;
    public width: string;
    public height: string;
    public recaudo:any;
    public fileUrl: string;
    public isImg:boolean;
    public pdfViewerActive = "";
    public subjectsService;
    public zoom: number = 0.4;
    public thumbnail: any;

    constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<VisualizarArchivoDialogComponent>,
        private sanitizer:DomSanitizer
	) {
		this.title = data.title;
        this.message = data.message;
        this.recaudo = data.recaudoObj;
        this.subjectsService = data.subjectService;
        this.isImg = data.isImg;
    }

    ngOnInit()
    {
        
        let fileUrl = this.recaudo;
        let fileFormat: string;
        if(!this.isImg)
        {
            fileFormat = 'pdf'
            let fileName = this.message;
            const bstr = atob(fileUrl);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--)
            {
                u8arr[n] = bstr.charCodeAt(n);
            }
            let file = new File([u8arr], fileName, { type: fileFormat });
            let dataType = file.type;
        
            let binaryData = [];
            binaryData.push(file);
            this.fileUrl = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        }
        else
        {
            let objectURL = 'data:image/jpeg;base64,'+fileUrl;
            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
    }

    onClick(option: string) 
    {
        if(option == 'Validar')
        {
            this.dialogRef.close('Validar');
        }
        else
        {
            this.dialogRef.close(null);
        }
    }
    
    public ngAfterViewInit() 
    {
        //console.log("this.fileUrl =>",this.fileUrl)    
    }

    cambiarZoomArchivo(accion: string) {
        if (accion == 'Ampliar') {
          this.zoom = this.zoom + 0.5;
        }
        else {
            this.zoom = this.zoom - 0.5;
        }
    }

}