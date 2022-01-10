import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChannelsRoutingModule } from "./channels-routing.module";
import { ChannelsComponent } from "./channels.component";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { DialogValidateModule } from "../../components/dialog-validate/dialog-validate.module";

@NgModule({
	declarations: [ChannelsComponent],
	imports: [
		CommonModule,
		ChannelsRoutingModule,
		MatIconModule,
		MatListModule,
		DialogValidateModule,
	],
})
export class ChannelsModule {}
