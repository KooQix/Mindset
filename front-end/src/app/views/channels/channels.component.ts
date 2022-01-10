import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Channel } from "src/interfaces/channel";
import { DialogValidateComponent } from "src/app/components/dialog-validate/dialog-validate.component";
import { ChannelsService } from "./channels.service";

@Component({
	selector: "app-channels",
	templateUrl: "./channels.component.html",
	styleUrls: ["./channels.component.scss"],
})
export class ChannelsComponent implements OnInit {
	channels: Channel[] = [];
	constructor(private service: ChannelsService, private dialog: MatDialog) {}

	async ngOnInit(): Promise<void> {
		this.channels = await this.service.getChannels();
	}

	openDialog(channelName: string) {
		const dialogRef = this.dialog.open(DialogValidateComponent, {
			data: {
				title: "Delete " + channelName,
				content: `Are you sure you want to delete ${channelName} and all its videos?`,
			},
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.service.rmChannel(channelName);
				setTimeout(async () => {
					this.channels = await this.service.getChannels();
				}, 2000);
			}
		});
	}

	goBack() {
		window.history.back();
	}
}
