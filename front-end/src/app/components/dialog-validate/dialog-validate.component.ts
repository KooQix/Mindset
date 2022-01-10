import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
	title: string;
	content: string;
}

@Component({
	selector: 'app-dialog-validate',
	templateUrl: './dialog-validate.component.html',
	styleUrls: ['./dialog-validate.component.scss'],
})
export class DialogValidateComponent {
	title: string = '';
	content: string = '';

	constructor(
		public dialogRef: MatDialogRef<DialogData>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {
		this.title = data.title;
		this.content = data.content;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
