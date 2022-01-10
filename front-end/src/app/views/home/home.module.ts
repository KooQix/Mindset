import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, MatSliderModule, ReactiveFormsModule, FormsModule],
	exports: [HomeComponent],
})
export class HomeModule {}
