import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayingComponent } from "./playing.component";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatSliderModule } from "@angular/material/slider";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { PlayingService } from "./playing.service";
import { AudioService } from "./audio.service";
import { PlayingRoutingModule } from "./playing-routing.module";

@NgModule({
	declarations: [PlayingComponent],
	imports: [
		CommonModule,
		PlayingRoutingModule,
		MatButtonModule,
		MatListModule,
		MatSliderModule,
		MatIconModule,
		MatToolbarModule,
		MatCardModule,
	],
	exports: [PlayingComponent],
	providers: [PlayingService, AudioService],
})
export class PlayingModule {}
