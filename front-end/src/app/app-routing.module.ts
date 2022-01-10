import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";

const routes: Routes = [
	{
		path: "",
		component: HomeComponent,
	},
	{
		path: "player",
		loadChildren: () =>
			import("./views/playing/playing.module").then(
				(m) => m.PlayingModule,
			),
	},
	{
		path: "channels",
		loadChildren: () =>
			import("./views/channels/channels.module").then(
				(m) => m.ChannelsModule,
			),
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
