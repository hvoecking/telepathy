import { CommonModule } from '@angular/common';
import { CreateRoomPage } from './create-room.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [{
  component: CreateRoomPage,
  path: '',
}];

@NgModule({
  declarations: [
    CreateRoomPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class CreateRoomPageModule {}
