import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'input[appNumbersOnly]'
})
export class NumbersOnlyDirective {

    constructor(private elementRef: ElementRef) { }
    @Output('appNumbersOnly')
    public numbers: EventEmitter<NumbersOnlyDirective> = new EventEmitter();
    @HostListener('input', ['$event']) onInputChange(event) {
        const initialValue = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
        if (initialValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }
        else { this.numbers.emit(this) }
    }

}