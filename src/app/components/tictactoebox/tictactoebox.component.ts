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
      // one for reads all player matchMoves into the gameserivceTictactoeBoard
      // one for reads the current playerMove if matches the current tictactoe tile then sets its value
      // whoever is the last player that clicked will be placed on previousPlayer for checking on click
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
                this.setPlayerMove();
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
    if (!this.value && 
      this.gameService.checkForWinner(localStorage.getItem("currentUserID")) == 
      undefined) {
      // record game player moves to memory which is tictactoe board property
      let currentPlayerID = localStorage.getItem("hostID") ? localStorage.getItem("hostID") : this.gameService.opponentPlayerUUID;
      this.gameService.playerMove(this.rowId, this.colId, this.gameService.currplayerChar, currentPlayerID);

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
