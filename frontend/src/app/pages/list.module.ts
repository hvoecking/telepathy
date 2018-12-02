/*!
 * Copyright 2018
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ListPage } from "~pages/list.page";

@NgModule({
  declarations: [ListPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        component: ListPage,
        path: "",
      },
    ]),
  ],
})
export class ListPageModule {}
