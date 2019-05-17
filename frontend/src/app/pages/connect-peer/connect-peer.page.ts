/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { ApplicationRef, Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IpfsService } from "~services/ipfs.service";

@Component({
  selector: `app-connect-peer`,
  styleUrls: [`./connect-peer.page.scss`],
  templateUrl: `./connect-peer.page.html`,
})
export class ConnectPeerPage {

  public readonly form: FormGroup = this.formBuilder.group({
    peerAddress: new FormControl(``, Validators.required),
  });

  constructor(
    private readonly app: ApplicationRef,
    private readonly formBuilder: FormBuilder,
    private readonly ipfsService: IpfsService,
    private readonly router: Router,
  ) { }

  public async connectPeer(result: { peerAddress: string }): Promise<void> {
    const { dirty, valid }: FormGroup = this.form;
    if (dirty && valid) {
      await this.ipfsService.connect(`/p2p-circuit/ipfs/${result.peerAddress}`);
      this.form.reset();
      await this.goBack();
    }
  }

  protected ionViewWillEnter(): void {
    this.app.tick();
  }

  private async goBack(): Promise<void> {
    await this.router.navigate([`/rooms`]);
  }
}
