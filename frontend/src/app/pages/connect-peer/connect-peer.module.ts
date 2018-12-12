import { CommonModule } from '@angular/common';
import { ConnectPeerPage } from '@pages/connect-peer/connect-peer.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [{
  component: ConnectPeerPage,
  path: '',
}];

@NgModule({
  declarations: [
    ConnectPeerPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class ConnectPeerPageModule {}