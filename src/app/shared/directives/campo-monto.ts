import { DecimalPipe } from '@angular/common';
import { Directive, Output, EventEmitter, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';
import BigNumber from "bignumber.js";

@Directive({
    selector: '[textCampoMonto]'
})
export class CampoMontoDirective {

    constructor(public model: NgControl) { }

    @Output() cambioValor: EventEmitter<number> = new EventEmitter<number>();

    @HostListener('ngModelChange', ['$event'])

    onInputChange(event: any) {
        let inicial = event.replace(/[^0-9]/g, '');
        if(inicial.trim().length>=0 && inicial != ""){

       
        let valorNumb = new BigNumber(event.replace(/[^0-9]/g, '')).div(100);
        if(event == null  || event == '' || event == undefined){
       
            this.cambioValor.emit(parseFloat(''));

        }else{
            let valor =  new BigNumber(valorNumb.toFixed(2));
            let fmt = {
                prefix: '',
                decimalSeparator: ',',
                groupSeparator: '.',
                groupSize: 3,
                secondaryGroupSize: 3
              };
          
            let valorFormateado =valor.toFormat(2, fmt); 
            this.model.valueAccessor.writeValue(valorFormateado);
            this.cambioValor.emit(parseFloat(valor.toString()));
       
        }
    
    }else{
        
        this.model.valueAccessor.writeValue(inicial);
        this.cambioValor.emit(inicial);
    }
    } 

}