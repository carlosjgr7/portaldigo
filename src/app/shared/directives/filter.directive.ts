import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'input[appFilter]'
})
export class FilterDirective {

    constructor(private elementRef: ElementRef) { }
    @Output('appFilter')
    public numbers: EventEmitter<FilterDirective> = new EventEmitter();
    @HostListener('input', ['$event']) onInputChange(event) {
        const initialValue = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.value = initialValue.replace(/[^A-Za-z0-9 ,.:;_/!@#$~&-]*/g, '');
        var end = this.elementRef.nativeElement.value.length;
     
        if(this.elementRef.nativeElement.value.substring(0,1) == " "){
            this.elementRef.nativeElement.value = this.elementRef.nativeElement.value.slice(0, -1);
            this.numbers.emit(this) 
   
        }else if(this.elementRef.nativeElement.value.substring(end-2,end-1) == " " && this.elementRef.nativeElement.value.substring(end-1,end) == " ") {
            this.elementRef.nativeElement.value = this.elementRef.nativeElement.value.slice(0, -1);
        
            this.numbers.emit(this) 
       }else if (initialValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }
        else { this.numbers.emit(this) }
    }

}