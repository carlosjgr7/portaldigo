import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'input[appPassword]'
})
export class PasswordDirective {

    constructor(private elementRef: ElementRef) { }
    @Output('appPassword')
    public numbers: EventEmitter<PasswordDirective> = new EventEmitter();
    @HostListener('input', ['$event']) onInputChange(event) {
        const initialValue = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.value = initialValue.replace(/[^A-Za-z0-9,._!?+@#$%&*-]*/g, '');
        if (initialValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }
        else { this.numbers.emit(this) }
    }

}