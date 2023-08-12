import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { e } from '@angular/core/src/render3';


const FILE_EXTENSION = '.txt';
@Injectable()
export class ConciliacionService 
{
  constructor()
  {}

  

  public exportAsTextFile(data: any[], conciliartionFileName: string): void 
  {
    var MyBlobBuilder = function() 
    {
      this.parts = [];
    }
    
    MyBlobBuilder.prototype.append = function(part) 
    {
      this.parts.push(part);
      this.blob = undefined; // Invalidate the blob
    };
    
    MyBlobBuilder.prototype.getBlob = function() {
      if (!this.blob) {
        this.blob = new Blob(this.parts, { type: "text/plain" });
      }
      return this.blob;
    };
    
    var myBlobBuilder = new MyBlobBuilder();

    for (var i = 0; i < data.length; i++)
    {
   
      myBlobBuilder.append(data[i]+"\n");;      
    }
    FileSaver.saveAs(myBlobBuilder.getBlob(), conciliartionFileName + FILE_EXTENSION);
  }

  private saveAsTextFile(buffer: any, fileName: string): void 
  {
    // const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
