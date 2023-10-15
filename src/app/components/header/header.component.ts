import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  sessionActive: boolean = false;
  // check here if gamecontrolService has Session UUID
  // then set session active to true if session is created
}
