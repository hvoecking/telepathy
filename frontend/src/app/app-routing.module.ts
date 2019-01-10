/*!
 * Copyright 2018
 */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: ``,
    pathMatch: `full`,
    redirectTo: `splash`,
  },
  {
    loadChildren: `./pages/splash.module#SplashPageModule`,
    path: `splash`,
  },
  {
    loadChildren: `./pages/home.module#HomePageModule`,
    path: `home`,
  },
  {
    loadChildren: `./pages/list.module#ListPageModule`,
    path: `list`,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, {useHash: true})],
})
export class AppRoutingModule {}
