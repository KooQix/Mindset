import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HomeService } from "./home.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
	constructor(private service: HomeService, private router: Router) {}
	sliderValue: number = 100;
	channelToAdd = "";
	videoToAdd = "";

	ngOnInit(): void {}

	addChannel() {
		this.service.addChannel(this.channelToAdd);
		this.channelToAdd = "";
	}

	async getVideos(max_duration: number) {
		await this.service.getVideos(max_duration);
		this.router.navigate(["/player"]);
	}

	goToChannels() {
		this.router.navigate(["/channels"]);
	}
}
