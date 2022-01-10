import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class ChannelsService {
	readonly API_URL = env.API_URL;
	constructor(private http: HttpClient) {}

	getChannels() {
		return this.http.get<any>(this.API_URL + "/channels").toPromise();
	}

	rmChannel(channelName: string) {
		return this.http
			.delete<any>(this.API_URL + "/channel", {
				body: {
					channelName: channelName,
				},
			})
			.toPromise();
	}
}
