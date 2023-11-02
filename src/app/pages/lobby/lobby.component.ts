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
  winner: any | undefined;
  isReady: boolean = false;
  @Input() waitMessage: any | undefined;
  // for host only
  isOpponentReady: boolean = false;

  constructor(private router: Router, private gameService:
    TictactoeGamecontrolService, private backendService:
    BackendServiceService) {}
  ngOnInit(): void {
    // sets up the lobby
    this.lobbySetup();
    // returns to home page when seshID is not existing
    setInterval(() => {
      if (!localStorage.getItem("seshID")) {
        this.router.navigate(['/'])
      }
    }, 200);
  }
  // lobby game setup
  private async lobbySetup() {
    if (localStorage.getItem("seshID")) {
      // looking for opponent
      setInterval(() => {
        // picks whoever turn first
        this.checkFirstTurn();
        this.checkIfPlayersReady();
        // checks if there is any winner in the current game
        this.checkWinner();
        // gets the hostname for display
        this.setHostNameView();
        // setup gamecontrol service
        this.setupGameControlService();
        // check reloadStatus session
        this.seshReloadStatusCheck();
        // check if opponent is ready
        this.checkOpponentIfReady();
      }, 3000);
    }
  }
  // gets player move
  private async checkOtherPlayerMove() {

  }
  // who will take first turn roll 0 and 1
  private async checkFirstTurn() {
    if (Math.random() == 0) {
      // send hostID to session
    }  else {
      // send currentUserID to session
    }
  }
  // get hostname
  private async setHostNameView() {
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
  }
  // check for winner
  private async checkWinner() {
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
  }
  // set up game control service info
  private async setupGameControlService(){
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
          this.gameService.hostID = obj.data.hostID;
          subs.unsubscribe();
        }
      });
    });
  }
  // check if opponent is ready
  private async checkOpponentIfReady() {
    this.backendService.getMatchStatus(localStorage.getItem("seshID"),
    this.gameService.opponentPlayerUUID)
    .then(body => {
      let subs = body.subscribe(value => {
        let obj: any;
        obj = value;
        // update the local property
        this.isOpponentReady = obj.data ? obj.data.isPlayerReady : false;
        if(value) {
          subs.unsubscribe();
        }
      })
    });
  }
  // check reload Status
  private async seshReloadStatusCheck() {
    if (!localStorage.getItem("hostID")) {
      await this.backendService.findSesh(localStorage.getItem("seshID"))
      .then(body => {
        let subs = body.subscribe( async value => {
          let obj: any;
          obj = value;
          if (obj && obj.data.sessionReloadStatus) {
            await this.backendService.updateReloadStatus(localStorage.getItem("seshID"))
            .then(body => {
              let subs = body.subscribe(value => {
                console.log(value);
                if (value) {
                    subs.unsubscribe();
                }
              })
            })
            .catch(err => {
              console.log(err);
            });
              location.reload();
          }
        });
      });
    }
  }
  // updates the button ready and startgame for users visibility
  private async checkIfPlayersReady() {
    let currentPlayer = localStorage.getItem("hostID") ? localStorage.getItem("hostID") :
    localStorage.getItem("currentUserID");
    // get match status if player is ready or not
    await this.backendService.getMatchStatus(localStorage.getItem("seshID"), currentPlayer)
    .then(body => {
      let subs = body.subscribe(value => {
        let obj: any;
        obj = value
        this.isReady = obj.data.isPlayerReady;
        if (value) {
          subs.unsubscribe();
        }
      });
    });
  }

  // click functions
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
          subs.unsubscribe();
        }
      })
    });
    // removes all session storage
    localStorage.removeItem("hostID");
    localStorage.removeItem("currentUserID");
    localStorage.removeItem("seshID");
  }
  async onRestart() {
    // resets the move matches only and players isPlayerReady status will be false
    await this.backendService.restartMatch(localStorage.getItem("seshID"))
    .then(body => {
      let subs = body.subscribe(value => {
        if(value) {
          console.log("match restarted");
          location.reload();
          subs.unsubscribe();
        }
      });
    })
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
}
