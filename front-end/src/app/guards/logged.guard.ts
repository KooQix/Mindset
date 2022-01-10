import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivateChild,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class LoggedGuard implements CanActivateChild {
	readonly API_URL = env.API_URL;

	constructor(private router: Router, private http: HttpClient) {}

	private isValidToken() {
		const token = localStorage.getItem("token");
		if (!!!token)
			return new Observable<boolean>((subscriber) => {
				subscriber.next(false);
				subscriber.complete();
			});
		return this.http.get<boolean>(`${this.API_URL}/login/token/${token}`);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		this.isValidToken().subscribe((res) => {
			if (!!!res) this.router.navigate(["/auth"]);
		});
		return this.isValidToken();
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		this.isValidToken().subscribe((res) => {
			if (!!!res) this.router.navigate(["/auth"]);
		});
		return this.isValidToken();
	}
}
