import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'input[appNumbersPuntuation]'
})
export class NumbersPuntuationDirective {

    constructor(private elementRef: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        const initialValue = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.value = initialValue.replace(/[^0-9,]*/g, ''); // no order
        if (initialValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }
    }

}