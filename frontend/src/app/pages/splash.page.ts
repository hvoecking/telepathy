import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as insertCSS from 'insert-css';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.page.html',
  styleUrls: ['splash.page.scss'],
})
export class SplashPage {

  constructor(
    private readonly router: Router,
  ) {

  }

  ionViewDidEnter() {
    const loadingContainer = document.getElementById('loading-container') as HTMLElement;
    const versionText = document.getElementById('app-name-version-text') as HTMLElement;
    const versionBox = versionText.getBoundingClientRect();
    const originLogo = document.getElementById('origin-logo') as HTMLElement;
    const originBox = originLogo.getBoundingClientRect();
    const targetLogo = document.getElementById('target-logo') as HTMLElement;
    const targetBox = targetLogo.getBoundingClientRect();

    // Check if the splash screen did already run
    if (!targetLogo) {
      return;
    }

    const animationDuration = 1000;
    const animation = `
      .move {
        animation: move ${animationDuration}ms ease-in-out forwards;
      }
      @keyframes move {
        0% {
          position: fixed;
          left: ${versionBox.left}px;
          top: ${versionBox.top - 32}px;
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
    insertCSS(animation);
    targetLogo.remove();
    originLogo.className = 'spin-move';
    versionText.className = 'move';
    this.router.navigate(['/home']);
    setTimeout(() => {
      loadingContainer.remove();
    }, animationDuration);

  }

}
