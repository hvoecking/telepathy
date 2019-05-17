/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { insertCss } from "insert-css";

const VERSION_BOX_TOP_MARGIN = 32;

@Component({
  selector: `app-splash`,
  styleUrls: [`splash.page.scss`],
  templateUrl: `splash.page.html`,
})
export class SplashPage {

  constructor(
    private readonly router: Router,
  ) {

  }

  protected ionViewDidEnter(): void {
    this.moveSplashscreen()
      .catch((e: Error) => console.error(e));
  }

  private async moveSplashscreen(): Promise<void> {
    const loadingContainer = document.getElementById(`loading-container`);
    const versionText = document.getElementById(`app-name-version-text`);
    const originLogo = document.getElementById(`origin-logo`);
    const targetLogo = document.getElementById(`target-logo`);

    // Check if the splash screen did already run
    if (
      loadingContainer === null ||
      versionText === null ||
      originLogo === null ||
      targetLogo === null
    ) {
      return;
    }

    const versionBox = versionText.getBoundingClientRect();
    const originBox = originLogo.getBoundingClientRect();
    const targetBox = targetLogo.getBoundingClientRect();
    const animationDuration = 1000;
    const animation = `
      .move {
        animation: move ${animationDuration}ms ease-in-out forwards;
      }
      @keyframes move {
        0% {
          position: fixed;
          left: ${versionBox.left}px;
          top: ${versionBox.top - VERSION_BOX_TOP_MARGIN}px;
        }
        to {
          position: fixed;
          top: ${targetBox.bottom}px;
          opacity: 0;
        }
      }
      .spin-move {
        animation: spin-move ${animationDuration}ms linear forwards;
      }
      @keyframes spin-move {
        0% {
          position: fixed;
          bottom: ${originBox.bottom}px;
          height: ${originBox.height}px;
          left: ${originBox.left}px;
          right: ${originBox.right}px;
          top: ${originBox.top}px;
          width: ${originBox.width}px;
          animation-timing-function:ease-in-out;
        }
        20% {
          transform: rotate(-15deg);
          animation-timing-function: ease-in-out;
        }
        85% {
          transform: rotate(375deg);
          animation-timing-function: ease-in-out;
        }
        100% {
          position: fixed;
          padding-top: 20px;
          padding-bottom: 20px;
          padding-left: 56px;
          padding-right: 56px;
          transform: rotate(360deg);
          bottom: ${targetBox.bottom}px;
          height: ${targetBox.height}px;
          left: ${targetBox.left}px;
          right: ${targetBox.right}px;
          top: ${targetBox.top}px;
          width: ${targetBox.width}px;
          animation-timing-function:ease-in-out;
        }
      }
      .disappear {
        animation: disappear ${animationDuration}ms ease-in forwards;
      }
      @keyframes disappear {
        100% {
          opacity: 0;
        }
      }
    `;
    insertCss(animation);
    targetLogo.remove();
    originLogo.className = `spin-move`;
    versionText.className = `move`;
    await this.router.navigate([`/rooms`]);
    setTimeout(
      () => {
        loadingContainer.remove();
      },
      animationDuration,
    );

  }

}
