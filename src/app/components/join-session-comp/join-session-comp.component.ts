import { Component, DoCheck } from '@angular/core';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-join-session-comp',
  templateUrl: './join-session-comp.component.html',
  styleUrls: ['./join-session-comp.component.css']
})
export class JoinSessionCompComponent implements DoCheck{
  username: string | undefined;
  sessionIDSeed: string | undefined;
  isSessionActive: boolean = true;
  errMessage: string | undefined;
  // on join session
  constructor(private backendService: BackendServiceService,
    private gameControlService: TictactoeGamecontrolService) {}
  onJoin() {
    // send join info's
    console.log(this.username);
    if (this.username) {
      this.backendService.joinSesh(this.sessionIDSeed,
        this.username)
        .then(data => {
          let subs = data.subscribe(value => {
            let obj: any;
            obj = value;
            if (obj.msg) {
              console.log(obj)
            } else {
              localStorage.setItem("seshID", obj.data.sessionID);
            }
          })
        }).catch(err => {
          console.log(err);
        })
    } else {
      this.errMessage = "please enter your name!!"
    }

  }
  ngDoCheck(): void {
    if (localStorage.getItem("seshID")) {
      this.isSessionActive = false;
    }
  }
}
