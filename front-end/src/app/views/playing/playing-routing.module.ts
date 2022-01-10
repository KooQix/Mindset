import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlayingComponent } from "./playing.component";

const routes: Routes = [
	{
		path: "",
		component: PlayingComponent,
	},
	{
		path: "**",
		redirectTo: "",
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PlayingRoutingModule {}
