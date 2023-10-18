import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-create-session-comp',
  templateUrl: './create-session-comp.component.html',
  styleUrls: ['./create-session-comp.component.css']
})
export class CreateSessionCompComponent implements DoCheck {
  // current user host name
  hostname: string = "";
  isSeshNotActive: boolean = true;
  seshID: string | null = "";
  errMessage: string | undefined;

  constructor(private router: Router,
    private backendService: BackendServiceService,
    private gameControlService: TictactoeGamecontrolService){}
  ngDoCheck(): void {
    if (localStorage.getItem("seshID")) {
      this.seshID = localStorage.getItem("seshID");
    }
  }
  onCreate() {
    // send to database
    // if no seshID in localstorage
    if (!localStorage.getItem("seshID")){
      if (this.hostname) {
        this.backendService.createSesh(this.hostname)
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            // store all data to gamecontrol service
            this.gameControlService.setupCurrentPlayerData(obj.res.hostID,
              obj.res.hostName,
              obj.res.sessionID,
              obj.res.opponentName,
              obj.res.opponentID);
            if (!localStorage.getItem("seshID")) {
              localStorage.setItem("seshID",obj.res.sessionID);
            }
            subs.unsubscribe();
            if (value && obj.isCreated) {
              this.router.navigate(['/lobby'])
            } else {
              this.errMessage = "no data!"
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.errMessage = "please enter hostname!!"
      }
    } else {
      console.log("sesh ID still valid!!");
      this.router.navigate(['/lobby']);
    }
    // recieve data and save to gamecontroservice
    // after recieving data from subscribe
    // get each data from it to gamecontrolservice
  }
  onFocus() {
    if (!this.hostname) {
      this.errMessage = undefined;
    }
  }
}
