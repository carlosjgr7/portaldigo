import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
	selector: 'app-completed-dialog',
    template: 
    `
    <h1 mat-dialog-title>{{title}}</h1>
    <div mat-dialog-content>
        <p style="white-space: pre-line;">{{message}}</p>
    </div>
    <div mat-dialog-actions align="center">
        <button mat-button (click)="onClick()">OK</button>
    </div>
    `,
})
export class CompletedDialogComponent {
    public title: string;
	public message: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<CompletedDialogComponent>
	) {
		this.title = data.title;
        this.message = data.message;
        this.dialogRef.disableClose = true;
    }
    
    onClick() {
		this.dialogRef.close();
	}
}