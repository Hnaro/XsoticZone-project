import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-session-comp',
  templateUrl: './create-session-comp.component.html',
  styleUrls: ['./create-session-comp.component.css']
})
export class CreateSessionCompComponent {

  constructor(private router: Router){}
  hostname: string = "";
  onCreate() {
    // send to database
    // recieve data and save to gamecontroservice
    if (this.hostname) {
      this.router.navigate(['/lobby'])
    } else {
      console.log("no data")
    }
  }
}
