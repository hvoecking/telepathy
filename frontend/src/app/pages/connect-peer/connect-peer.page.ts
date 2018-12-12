import * as _ from 'lodash';
import { ApplicationRef } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { IpfsService } from '@services/ipfs.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-connect-peer',
  styleUrls: ['./connect-peer.page.scss'],
  templateUrl: './connect-peer.page.html',
})
export class ConnectPeerPage {

  public readonly form: FormGroup = this.formBuilder.group({
    peerAddress: new FormControl('', Validators.required),
  });

  constructor(
    private readonly app: ApplicationRef,
    private readonly formBuilder: FormBuilder,
    private readonly ipfsService: IpfsService,
    private readonly router: Router,
  ) { }

  ionViewWillEnter() {
    this.app.tick();
  }

  goBack() {
    this.router.navigate(['/rooms']);
  }

  connectPeer(result) {
    const { dirty, valid } = this.form;
    if (dirty && valid) {
      this.ipfsService.connect('/p2p-circuit/ipfs/' + result.peerAddress);
      this.form.reset();
      this.goBack();
    }
  }
}