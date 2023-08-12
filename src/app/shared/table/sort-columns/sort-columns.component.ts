import { Component, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from "@angular/material";

@Component({
	selector: 'app-sort-columns',
	templateUrl: './sort-columns.component.html',
	styleUrls: ['./sort-columns.component.scss']
})
export class SortColumnsComponent {

	@ViewChild(MatSelectionList) selection: MatSelectionList;

	columns: any[];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<SortColumnsComponent>
	) {
		this.columns = data.columns;
	}

	changeColumns() {
		this.dialogRef.close(this.selection.selectedOptions.selected.map((option) => option.value));
	}

}