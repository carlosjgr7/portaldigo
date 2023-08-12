import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
	selector: 'app-alert-dialog',
	templateUrl: 'alert-dialog.component.html',
})
export class AlertDialogComponent {

	public title: string;
	public message: string;
	public yesOption: string;
	public noOption: string = null;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<AlertDialogComponent>
	) {
		this.title = data.title;
		this.message = data.message;
		this.yesOption = data.yes;
		this.noOption = data.no;
	}

	onClick(option: number) {
		this.dialogRef.close(option);
	}

}