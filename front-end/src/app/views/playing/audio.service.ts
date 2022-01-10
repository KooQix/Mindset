import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { File, _File } from "src/interfaces/file";

@Injectable({ providedIn: "root" })
export class AudioService {
	constructor() {}

	static files: File[] = [];

	getFiles() {
		return of(AudioService.files);
	}

	setFiles(files: _File[]) {
		for (const file of files) {
			AudioService.files.push({
				id: file.id,
				channel: file.channel,
				title: file.title,
				duration: file.duration,
			});
		}
	}

	resetFiles() {
		AudioService.files = [];
	}
}
