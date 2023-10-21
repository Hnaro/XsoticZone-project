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
  serverErrMsg: string | undefined
  // on join session
  constructor(private backendService: BackendServiceService,
    private gameControlService: TictactoeGamecontrolService) {}
  onJoin() {
    // send join info's
    if (this.username && this.sessionIDSeed) {
      this.backendService.joinSesh(this.sessionIDSeed,
        this.username)
        .then(data => {
          let subs = data.subscribe(value => {
            let obj: any;
            obj = value;
            if (obj.msg) {
              this.serverErrMsg = obj.msg;
            } else {
              console.log(obj);
              this.gameControlService.hostID = obj.data.hostID;
              this.gameControlService.hostname = obj.data.hostName;
              localStorage.setItem("seshID", obj.data.sessionID);
              localStorage.setItem("currentUserID", obj.data.opponentID)
              subs.unsubscribe();
            }
          })
        }).catch(err => {
          console.log(err);
        })
    } else {
      this.serverErrMsg = "please make sure that name and Session id is in the field!!"
    }

  }
  ngDoCheck(): void {
    if (localStorage.getItem("seshID")) {
      this.isSessionActive = false;
    }
  }
  onFocusChallengeInput() {
    if (!this.username) {
      this.serverErrMsg = "";
    }
  }
  onFocusUserInput() {
    if (!this.sessionIDSeed) {
      this.serverErrMsg = "";
    }
  }
}
