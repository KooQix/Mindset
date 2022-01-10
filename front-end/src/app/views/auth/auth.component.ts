import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
	selector: "app-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
	pass = "";

	constructor(private service: AuthService, private router: Router) {}

	ngOnInit(): void {}

	async login() {
		const response = await this.service.login(this.pass);
		if (response.error) {
			localStorage.clear();
			return;
		}
		if (response.token) {
			localStorage.setItem("token", response.token);
			this.router.navigate(["/"]);
		}
	}
}
