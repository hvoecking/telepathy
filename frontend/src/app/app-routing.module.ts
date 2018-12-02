/*!
 * Copyright 2018
 */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  {
    loadChildren: "./pages/home/home.module#HomePageModule",
    path: "home",
  },
  {
    loadChildren: "./pages/list/list.module#ListPageModule",
    path: "list",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {useHash: true})],
})
export class AppRoutingModule {}
