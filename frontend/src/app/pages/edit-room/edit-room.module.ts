import { CommonModule } from '@angular/common';
import { EditRoomPage } from './edit-room.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [{
  component: EditRoomPage,
  path: '',
}];

@NgModule({
  declarations: [
    EditRoomPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class EditRoomPageModule {}
