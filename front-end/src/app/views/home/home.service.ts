import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from "src/environments/environment";
import { AudioService } from "../playing/audio.service";

@Injectable({
	providedIn: "root",
})
export class HomeService {
	readonly API_URL = env.API_URL;

	constructor(private http: HttpClient, private audioService: AudioService) {}

	addChannel(channel: string) {
		return this.http
			.post<any>(this.API_URL + "/manage/channel", {
				channelName: channel,
			})
			.toPromise();
	}

	async getVideos(max_duration: number) {
		const videos = await this.http
			.get<any>(this.API_URL + "/manage/videos/" + max_duration)
			.toPromise();
		this.audioService.setFiles(videos);
	}
}
