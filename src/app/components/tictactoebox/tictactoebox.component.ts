import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';
@Component({
  selector: 'app-tictactoebox',
  templateUrl: './tictactoebox.component.html',
  styleUrls: ['./tictactoebox.component.css']
})
export class TictactoeboxComponent implements OnInit{
  @Input() rowId: any;
  @Input() colId: any;
  @Input() value: string | undefined;

  //roll dice if if 0 then host id if 1 then currentUserID
  firstTurn: any | undefined;
  constructor(private gameService: TictactoeGamecontrolService,
    private backendService: BackendServiceService){}

  ngOnInit(): void {
    // sets the playerChar for player
    this.setupPlayerChar();
    this.checkPlayerMove()
    // host is X other player is O
  }
  private async setupPlayerChar() {
    this.gameService.firstMove = "X";
    if (localStorage.getItem("hostID")) {
      this.gameService.currplayerChar = "X";
    } else {
      this.gameService.currplayerChar = "O";
    }
  }
  // continously check's player move
  private async checkPlayerMove() {
    await setInterval( async () => {
      this.backendService.getPlayerMatchMove(localStorage.getItem("seshID"))
      .then(body => {
        let subs = body.subscribe(value => {
          if (value) {
            let anonymousObject: Array<any>;
            console.log(value);
            // create an array from anonymous object and extract its index from 0 to get the array of values
            anonymousObject = Object.values(value)[0];
            anonymousObject.map((obj) => {
              let r = String(obj.playerMove).charAt(1);
              let c = String(obj.playerMove).charAt(4);
              if (this.gameService.opponentPlayerUUID == obj.playerID) {
                if (this.rowId == r && this.colId == c && !this.value) {
                  this.value = "O";
                }
              }
              if (this.gameService.hostID == obj.playerID) {
                if (this.rowId == r && this.colId == c && !this.value) {
                  this.value = "X";
                }
              }
            })
            subs.unsubscribe();
          }
        });
      })
    }, 3000);
  }

  onClick() {
    // cannot click when current tile has value
    // opponent is not ready then game cannot start
    this.backendService.getMatchStatus(localStorage.getItem("seshID"),
    this.gameService.opponentPlayerUUID)
    .then(body => {
      let subsI = body.subscribe(value => {
        let obj:any;
        obj = value;
        if (obj.data.isPlayerReady) {
          // wait for host if ready
          this.backendService.getMatchStatus(localStorage.getItem("seshID"),
          this.gameService.hostID)
          .then(body => {
            let subsJ = body.subscribe(value => {
              let obj:any;
              obj = value;
              if (obj.data.isPlayerReady) {
                // check first who's turn if hostID or currentUserID is equal to turnID of sessionID then clickable
                this.backendService.findSesh(localStorage.getItem("seshID"))
                .then(body => {
                  let subs = body.subscribe(value => {
                    let obj: any;
                    obj = value;
                    if (value) {
                      if (localStorage.getItem("hostID") && obj.data.turnID == localStorage.getItem("hostID")) {
                        this.setPlayerMove();
                        // update sessionTurn to opponent
                        this.backendService.updateSessionTurn(localStorage.getItem("seshID"),
                        obj.data.opponentID)
                        .then(body => {
                          let subs = body.subscribe(value => {
                            if (value) {
                              console.log(value);
                              subs.unsubscribe()
                            }
                          })
                        });
                      } else {
                        console.log("wait for opponent's turn")
                      }
                      if (localStorage.getItem("currentUserID") && obj.data.turnID == localStorage.getItem("currentUserID")) {
                        this.setPlayerMove();
                        // update sessionTurn to opponent
                        this.backendService.updateSessionTurn(localStorage.getItem("seshID"),
                        obj.data.hostID)
                        .then(body => {
                          let subs = body.subscribe(value => {
                            if (value) {
                              console.log(value);
                              subs.unsubscribe()
                            }
                          })
                        });
                      }else {
                        console.log("wait for opponent's turn")
                      }
                      subs.unsubscribe();
                    }
                  });
                });
                subsI.unsubscribe();
                subsJ.unsubscribe();
              }else {
                console.log("please ready first");
              }
            });
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    })
    // if host id is not ready then game cannot start

    // implement this feature for alternate
    // can only be clicked when previous player is not current player on storage
  }
  // sets the player moves
  private setPlayerMove() {
    // check first if current box has no value and has no winner
    if (!this.value && !this.gameService.winner) {
      let currentPlayerID = localStorage.getItem("hostID") ? localStorage.getItem("hostID") : this.gameService.opponentPlayerUUID;
      // sets the value for current tictactoe box
      this.value = this.gameService.currplayerChar;
      // sets the name for currPlayerLocation box
      let currplayerMove = "r"+this.rowId+"-"+"c"+this.colId;
      // send player move to the server
      this.backendService.currentplayerMove(currentPlayerID, localStorage.getItem("seshID"), currplayerMove)
      .then(body => {
        let subs = body.subscribe(value => {
          let obj: any;
          obj = value;
          console.log(obj);
        });
      });
    }
  }
}
