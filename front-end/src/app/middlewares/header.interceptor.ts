import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		const token = localStorage.getItem("token");
		if (!!!token) return next.handle(request);

		const cloned = request.clone({
			headers: new HttpHeaders({
				token: token,
			}),
		});
		return next.handle(cloned);
	}
}
