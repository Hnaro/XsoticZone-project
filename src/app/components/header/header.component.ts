import { Component, OnInit, Input, DoCheck } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements DoCheck{
  sessionActive: any;
  // check here if gamecontrolService has Session UUID
  // then set session active to true if session is created
  constructor() {
  }
  ngDoCheck(): void {
    if (localStorage.getItem("seshID")) {
      this.sessionActive = true;
    }
  }
}
