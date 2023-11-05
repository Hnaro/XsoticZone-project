import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';
import { ColRowModel } from 'src/app/model/rowModel';
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
      setInterval(async () => {
        // check reloadStatus session
        // picks whoever turn first
        await this.backendService.findSesh(localStorage.getItem("seshID"))
        .then(body => {
          let subs = body.subscribe(async value => {
            if (value) {
              let obj: any;
              obj = value;
              if (!obj?.data.turnID) {
                await this.checkFirstTurn();
              }
              subs.unsubscribe();
            }
          });
        })
        this.seshReloadStatusCheck();
        this.checkIfPlayersReady();
        // checks if there is any winner in the current game
        await this.savesTheWinner();
        // gets the hostname for display
        await this.setHostNameView();
        // setup gamecontrol service
        await this.setupGameControlService();
        // check if opponent is ready
        await this.checkOpponentIfReady();
        // track players movement
        await this.checkOtherPlayerMove();
        // check who's turn is next
      }, 1000);
    }
  }
  // gets player move
  // records the data from the lobby to the player board to check for winner
  private async checkOtherPlayerMove() {
    this.backendService.getPlayerMatchMove(localStorage.getItem("seshID"))
    .then(body => {
      let subs = body.subscribe(value => {
        if (value) {
          let anonymousObject: Array<any>;
          // create an array from anonymous object and extract its index from 0 to get the array of values
          anonymousObject = Object.values(value)[0];
          anonymousObject?.map((obj) => {
            // convert string to integer and extrating the number from the string
            let r = Number.parseInt(String(obj.playerMove).charAt(1));
            let c = Number.parseInt(String(obj.playerMove).charAt(4));
            if (this.gameService.hostID == obj.playerID) {
              this.gameService.playerMove(r,c,"X",obj.playerID);
            }
            if (this.gameService.opponentPlayerUUID == obj.playerID) {
              this.gameService.playerMove(r,c,"O", obj.playerID);
            }
          })
          subs.unsubscribe();
        }
      });
    });
  }
  // who will take first turn roll 0 and 1
  private async checkFirstTurn() {
    // this only runs on host
    if (localStorage.getItem("hostID") && this.gameService.opponentPlayerUUID) {
      let coin = Math.round(Math.random()) == 0 ? "heads" : "tails";
      switch (coin) {
        case "heads":
          // if heads update sessionTurnID to host
          if (this.gameService.hostID) {
          this.backendService.updateSessionTurn(localStorage.getItem("seshID"),  this.gameService.hostID)
          .then(body => {
            let subs = body.subscribe(value => {
              if (value) {
                console.log(value);
                subs.unsubscribe();
              }
            });
          });
        }
          break;
        case "tails":
          // if tails update sessionTurnID to opponent
          if (this.gameService.opponentPlayerUUID) {
            this.backendService.updateSessionTurn(localStorage.getItem("seshID"),  this.gameService.opponentPlayerUUID)
            .then(body => {
              let subs = body.subscribe(value => {
                if (value) {
                  console.log(value);
                  subs.unsubscribe();
                }
              });
            });
          }
          break;
      }
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
  // saves the winner to database and updates the view
  private async savesTheWinner() {
    if (this.gameService.checkForWinner()) {
      await this.backendService.updateWinner(localStorage.getItem("seshID"), this.gameService.winner)
      .then(body => {
        let subs = body.subscribe(value => {
          if (value) {
            let obj: any;
            obj = value;
            this.waitMessage = this.gameService.winner;
            subs.unsubscribe()
          }
        })
      });
    } else {
      await this.backendService.updateWinner(localStorage.getItem("seshID"), null)
      .then(body => {
        let subs = body.subscribe(value => {
          if (value) {
            let obj: any;
            obj = value;
            this.waitMessage = this.gameService.winner;
            subs.unsubscribe()
          }
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
    if (localStorage.getItem("currentUserID")) {
      await this.backendService.findSesh(localStorage.getItem("seshID"))
      .then(body => {
        let subs = body.subscribe( async value => {
          let obj: any;
          obj = value;
          if (obj && obj.data.sessionReloadStatus) {
            await this.backendService.updateReloadStatus(localStorage.getItem("seshID"))
            .then(body => {
              let subs = body.subscribe(value => {
                if (value) {
                  subs.unsubscribe();
                  location.reload();
                }
              })
            })
            .catch(err => {
              console.log(err);
            });
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
          this.gameService.currPlayerBoard =  new Array<ColRowModel>(9).fill({
            playerID: undefined,
            name: undefined,
            value: undefined
          });
          this.gameService.winner = null;
          console.log(value);
          subs.unsubscribe();
          location.reload();
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
