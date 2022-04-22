import { Component, OnInit } from "@angular/core";
import { StreamState } from "src/interfaces/stream-state";
import { AudioService } from "./audio.service";
import { PlayingService } from "./playing.service";
import { File } from "src/interfaces/file";

@Component({
	selector: "app-playing",
	templateUrl: "./playing.component.html",
	styleUrls: ["./playing.component.scss"],
})
export class PlayingComponent implements OnInit {
	files: File[] = [];

	state: StreamState;
	currentFile: File;

	constructor(
		public audioService: AudioService,
		public service: PlayingService,
	) {
		// get media files
		this.audioService.getFiles().subscribe((files) => {
			this.files = files;
			this.currentFile = files[0];
			this.openFile(0);
			this.play();
		});
		// listen to stream state
		this.service.getState().subscribe((state) => {
			this.state = state;
			this.state.readableDuration = this.service.formatTime(
				this.currentFile.duration - 3,
			);
			this.state.duration = this.currentFile.duration;
			if (
				!!state.readableCurrentTime &&
				!!state.readableDuration &&
				state.readableCurrentTime === state.readableDuration
			) {
				this.next();
				this.play();
			}
		});
	}

	ngOnInit() {}

	openFile(index: number) {
		this.currentFile = this.files[index];
		this.service.stop();
		this.playStream(this.currentFile.id);
	}

	playStream(id: number) {
		this.service.playStream(id).subscribe((events) => {
			// listening for fun here
		});
	}

	pause() {
		this.service.pause();
	}
	play() {
		// if (!!!this.start) {
		// 	this.openFile(0);
		// 	this.start = false;
		// }
		this.service.play();
	}
	stop() {
		this.service.stop();
	}

	next() {
		const index = this.files.indexOf(this.currentFile) + 1;
		this.currentFile = this.files[index];
		this.openFile(index);
	}
	previous() {
		const index = this.files.indexOf(this.currentFile) - 1;
		this.currentFile = this.files[index];
		this.openFile(index);
	}

	isFirstPlaying() {
		return this.currentFile === this.files[0];
	}

	isLastPlaying() {
		return this.currentFile === this.files[this.files.length - 1];
	}

	onSliderChangeEnd(change: any) {
		this.service.seekTo(change.value);
	}

	goBack() {
		this.stop();
		this.audioService.resetFiles();
		window.history.back();
	}
}
