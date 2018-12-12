import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RoomService } from '@services/room.service';
import { RoomsPage } from '@pages/rooms/rooms.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RoomsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      component: RoomsPage,
    }]),
  ],
  providers: [
    RoomService,
  ],
})
export class RoomsPageModule {}
