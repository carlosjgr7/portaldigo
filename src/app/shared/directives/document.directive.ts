import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'input[appDocument]'
})
export class DocumentDirective {

    constructor(private elementRef: ElementRef) { }
    @Output('appDocument')
    public document: EventEmitter<DocumentDirective> = new EventEmitter();
    @HostListener('input', ['$event']) onInputChange(event) {
        const initialValue = this.elementRef.nativeElement.value;
        this.elementRef.nativeElement.value = initialValue.replace(/^[JGVEP][0-9]{11}/g, '');
        if (initialValue !== this.elementRef.nativeElement.value) {
            event.stopPropagation();
        }
        else { this.document.emit(this) }
    }

}