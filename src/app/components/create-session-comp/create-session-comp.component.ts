import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-create-session-comp',
  templateUrl: './create-session-comp.component.html',
  styleUrls: ['./create-session-comp.component.css']
})
export class CreateSessionCompComponent {
  // current user host name
  hostname: string = "";

  constructor(private router: Router,
    private backendService: BackendServiceService,
    private gameControlService: TictactoeGamecontrolService){}
  onCreate() {
    // send to database
    this.backendService.createSesh(this.hostname)
    .then(body => {
      let subs = body.subscribe(value => {
        console.log(value);
        subs.unsubscribe();
        if (value) {
          this.router.navigate(['/lobby'])
        } else {
          console.log("no data")
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
    // recieve data and save to gamecontroservice
    // after recieving data from subscribe
    // get each data from it to gamecontrolservice

  }
}