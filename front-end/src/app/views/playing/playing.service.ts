import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { StreamState } from "src/interfaces/stream-state";

import { environment as env } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class PlayingService {
	readonly API_URL = env.API_URL;

	private stop$ = new Subject();
	private audioObj = new Audio();
	audioEvents = [
		"ended",
		"error",
		"play",
		"playing",
		"pause",
		"timeupdate",
		"canplay",
		"loadedmetadata",
		"loadstart",
	];

	constructor(private http: HttpClient) {}

	//////////////////// Managing state \\\\\\\\\\\\\\\\\\\\

	private state: StreamState = {
		playing: false,
		readableCurrentTime: "",
		readableDuration: "",
		duration: undefined,
		currentTime: undefined,
		canplay: false,
		error: false,
	};

	/**
	 * Emit state changes
	 */
	private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
		this.state,
	);

	private updateStateEvents(event: Event): void {
		switch (event.type) {
			case "canplay":
				this.state.duration = this.audioObj.duration;
				this.state.readableDuration = this.formatTime(
					this.state.duration,
				);
				this.state.canplay = true;
				break;
			case "playing":
				this.state.playing = true;
				break;
			case "pause":
				this.state.playing = false;
				break;
			case "timeupdate":
				this.state.currentTime = this.audioObj.currentTime;
				this.state.readableCurrentTime = this.formatTime(
					this.state.currentTime,
				);
				break;
			case "error":
				this.resetState();
				this.state.error = true;
				break;
		}
		this.stateChange.next(this.state);
	}

	private resetState() {
		this.state = {
			playing: false,
			readableCurrentTime: "",
			readableDuration: "",
			duration: undefined,
			currentTime: undefined,
			canplay: false,
			error: false,
		};
	}

	getState(): Observable<StreamState> {
		return this.stateChange.asObservable();
	}

	//////////////////// Managing audio \\\\\\\\\\\\\\\\\\\\

	private streamObservable(url: string) {
		return new Observable((observer) => {
			// Play audio
			this.audioObj.src = url + `?token=${localStorage.getItem("token")}`;
			this.audioObj.load();
			this.audioObj.play();

			const handler = (event: Event) => {
				this.updateStateEvents(event);
				observer.next(event);
			};

			this.addEvents(this.audioObj, this.audioEvents, handler);
			return () => {
				// Stop Playing
				this.audioObj.pause();
				this.audioObj.currentTime = 0;
				// remove event listeners
				this.removeEvents(this.audioObj, this.audioEvents, handler);
				// reset state
				this.resetState();
			};
		});
	}

	private addEvents(obj: any, events: any, handler: any) {
		events.forEach((event: any) => {
			obj.addEventListener(event, handler);
		});
	}

	private removeEvents(obj: any, events: any, handler: any) {
		events.forEach((event: any) => {
			obj.removeEventListener(event, handler);
		});
	}

	playStream(id: number) {
		const url = `${this.API_URL}/manage/stream/${id}`;
		return this.streamObservable(url).pipe(takeUntil(this.stop$));
	}

	// Play, stop ...
	play() {
		this.audioObj.play();
	}

	pause() {
		this.audioObj.pause();
	}

	stop() {
		this.stop$.next();
	}

	seekTo(seconds: number) {
		this.audioObj.currentTime = seconds;
	}

	formatTime(time: number, format: string = "HH:mm:ss") {
		const momentTime = time * 1000;
		return moment.utc(momentTime).format(format);
	}
}
