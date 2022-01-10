import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogValidateComponent } from './dialog-validate.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [DialogValidateComponent],
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	exports: [DialogValidateComponent],
})
export class DialogValidateModule {}
