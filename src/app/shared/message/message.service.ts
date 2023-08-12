import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class Message {
    class: string;
    text: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {

    private messageSubject = new BehaviorSubject<Message>(null);

    public message = this.messageSubject.asObservable();

    constructor() { }

    updateMessage(message: Message) {
        this.messageSubject.next(message);

        setTimeout(() => { 
            this.messageSubject.next(null);
        }, 10000);
    }

}