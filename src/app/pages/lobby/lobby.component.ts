import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  t: any;
  // only for player who will join
  isHostActive: boolean = false;
  // display lobby info property
  sessionID: any;
  hostname: string | undefined;
  opponentName: string | undefined;
  opponentSeshID: any;
  // check if another player joined
  isOpponentJoin: boolean | undefined;
  isGameStarted: any;
  i: any;
  winner: any | undefined;
  isReady: boolean = false;

  @Input() waitMessage: any | undefined;

  // for host only
  isOpponentReady: boolean = false;
  constructor(private router: Router, private gameService: TictactoeGamecontrolService, private backendService: BackendServiceService) {}
  ngOnInit(): void {

    // picks whoever turn first
      if (Math.random() == 0) {
        // send hostID to session
      }  else {
        // send currentUserID to session
      }
    this.checkIfPlayersReady();
    // create set Interval here that reads value all the time in the game
    this.i = setInterval(() => {
    // add feature if match Reload is true on sessionStatusReload
    // then reload once if localstorage is opponentID or currentUserID
    // then after reload once sets the sessionStatus back to false
    
      // checks if there is any winner in the current game
      if (this.gameService.checkForWinner(localStorage.getItem("currentUserID"))) {
        this.gameService.winner = this.gameService.checkForWinner(localStorage.getItem("hostID"));
        this.backendService.updateWinner(localStorage.getItem("seshID"), this.gameService.winner)
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            this.waitMessage = "winner is: "+obj.winnerName;
          })
        });
      } 
    }, 2000);
    // gets the hostname for display
    if (localStorage.getItem("hostID") && localStorage.getItem("seshID")){
      this.isHostActive = true;
      this.sessionID = localStorage.getItem("seshID");
      this.backendService.findSesh(
        localStorage.getItem("seshID"))
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            this.hostname = obj.data.hostName;
          })
        })
    }
    // wait for opponent
    if (localStorage.getItem("seshID")) {
      // looking for opponent
      setInterval(() => {
        this.backendService.findSesh(localStorage.getItem("seshID"))
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            if (obj.data.opponentName && obj.data.opponentID) {
              // sets the gameservuce and other local properties
              this.gameService.opponentname = obj.data.opponentName;
              this.gameService.opponentPlayerUUID = obj.data.opponentID;
              this.isOpponentJoin = true;
              this.opponentName = this.gameService.opponentname;
              this.opponentSeshID = obj.data.sessionID;
              this.sessionID = localStorage.getItem("seshID");
              this.hostname = obj.data.hostName;
              subs.unsubscribe();
            }
          });
        })
        // check if opponent is ready
        this.backendService.getMatchStatus(localStorage.getItem("seshID"),
        this.gameService.opponentPlayerUUID)
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            // update the local property
            this.isOpponentReady = obj.data.isPlayerReady
            if(value) {
              subs.unsubscribe();
            }
          })
        });
      }, 1000);
    }
    // returns to home page when seshID is not existing
    setInterval(() => {
      if (!localStorage.getItem("seshID")) {
        this.router.navigate(['/'])
      }
    }, 200);
  }

  // ends the session
  async endSession() {
    await this.backendService.endSesh(localStorage.getItem("seshID"))
    .then(body => {
      let subs = body.subscribe(value => {
        let obj: any;
        obj = value;
        if (obj.msg) {
          console.log(obj);
          location.reload();
        }
      })
    });
    // removes all session storage
    localStorage.removeItem("hostID");
    localStorage.removeItem("currentUserID");
    localStorage.removeItem("seshID");
  }
  async onRestart() {
    // add a feature here that when reloads sets the sessionReloadStatus to true

    // resets the move matches only and players isPlayerReady status will be false
    await this.backendService.restartMatch(localStorage.getItem("seshID"))
    .then(body => {
      let subs = body.subscribe(value => {
        console.log(value);
        if(value) {
          subs.unsubscribe();
        }
      });
    })
    location.reload();
    // resets the board in the game control service
  }
  async onStart(){
    // first get the opponent player if current match status is ready then
    // host can start
    if (this.isOpponentReady) {
      // if opponent is ready
      await this.backendService.updateMatchStatus(localStorage.getItem("hostID"), 
      localStorage.getItem("seshID"), true).then(body => {
        let subs = body.subscribe(data => {
          console.log(data);
          if (data) {
            // hides the ready button
            this.isReady = true;
            subs.unsubscribe();
          }
        });
      });
    } else {
      console.log("cannot start until opponent is ready!")
    }
    // update the matches data
  }
  async onReady() {
    await this.backendService.updateMatchStatus(localStorage.getItem("currentUserID"), 
    localStorage.getItem("seshID"), true).then(body => {
      let subs = body.subscribe(data => {
        console.log(data);
        if(data) {
          // hides the ready button
          this.isReady = true;
          subs.unsubscribe();
        } 
      });
    });
    // when opponent is ready
  }
  // updates the button ready and startgame for users visibility 
  private async checkIfPlayersReady() {
    let currentPlayer = localStorage.getItem("hostID") ? localStorage.getItem("hostID") : 
    localStorage.getItem("currentUserID");
    await this.backendService.getMatchStatus(localStorage.getItem("seshID"), currentPlayer)
    .then(body => {
      let subs = body.subscribe(value => {
        let obj: any;
        obj = value;
        this.isReady = obj.data.isPlayerReady;
        if (value) {
          subs.unsubscribe();
        }
      });
    });
  }
}
