import { LoggedGuard } from "./guards/logged.guard";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";

const routes: Routes = [
	{
		path: "",
		canActivate: [LoggedGuard],
		component: HomeComponent,
	},
	{
		path: "player",
		canActivateChild: [LoggedGuard],
		loadChildren: () =>
			import("./views/playing/playing.module").then(
				(m) => m.PlayingModule,
			),
	},
	{
		path: "channels",
		canActivateChild: [LoggedGuard],
		loadChildren: () =>
			import("./views/channels/channels.module").then(
				(m) => m.ChannelsModule,
			),
	},
	{
		path: "auth",
		loadChildren: () =>
			import("./views/auth/auth.module").then((m) => m.AuthModule),
	},
	{
		path: "**",
		redirectTo: "",
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
