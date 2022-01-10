import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	readonly API_URL = env.API_URL;

	constructor(private http: HttpClient) {}

	async login(pass: string) {
		return this.http
			.post<{
				error?: string;
				token?: string;
			}>(`${this.API_URL}/login`, {
				pass: pass,
			})
			.toPromise();
	}
}
