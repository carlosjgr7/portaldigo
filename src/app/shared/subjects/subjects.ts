import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";



@Injectable({ providedIn: 'root' })
export class SubjectsService {

    private pdfViewerActiveSubject = new BehaviorSubject<string>(null);

    public pdfViewerActive = this.pdfViewerActiveSubject.asObservable();

    constructor() { }

    updatePdfViewerActive(id: string) {
        this.pdfViewerActiveSubject.next(id);
    }

}