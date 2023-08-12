import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'input[appLettersNumbersOnly]'
})
export class LettersNumbersOnlyDirective {

    constructor(private elementRef: ElementRef) { }
    @Output('appLettersNumbersOnly')
    public numbers: EventEmitter<LettersNumbersOnlyDirective> = new EventEmitter();
    @HostListener('input', ['$event']) onInputChange(event) {
        const initialValue = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.value = initialValue.replace(/[^A-Za-z0-9]*/g, '');
        if (initialValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }
        else { this.numbers.emit(this) }
    }

}