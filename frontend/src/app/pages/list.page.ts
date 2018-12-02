/*!
 * Copyright 2018
 */

import { Component } from "@angular/core";

interface Item {
  icon: string;
  note: string;
  title: string;
}

@Component({
  selector: "app-list",
  styleUrls: ["list.page.scss"],
  templateUrl: "list.page.html",
})
export class ListPage {
  public items: Item[] = [];
  public readonly numberOfItems: number = 10;

  constructor() {
    for (let i = 1; i <= this.numberOfItems; i++) {
      this.items.push({
        icon: this.icons[Math.floor(Math.random() * this.icons.length)],
        note: `This is item #${i}`,
        title: `Item ${i}`,
      });
    }
  }

  private icons: string[] = [
    "flask",
    "wifi",
    "beer",
    "football",
    "basketball",
    "paper-plane",
    "american-football",
    "boat",
    "bluetoot,h",
    "build",
  ];
}
