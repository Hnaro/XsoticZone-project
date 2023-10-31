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
  @Input() value: string = "";

  //roll dice if if 0 then host id if 1 then currentUserID
  firstTurn: any | undefined;
  constructor(private gameService: TictactoeGamecontrolService, 
    private backendService: BackendServiceService){}

  ngOnInit(): void {
    // sets the playerChar for player
    this.gameService.firstMove = "X";
    if (localStorage.getItem("hostID")) {
      this.gameService.currplayerChar = "X";
    } else {
      this.gameService.currplayerChar = "O";
    }
    this.checkPlayerMove()
    // host is X other player is O
  }
  // continously check's player move
  async checkPlayerMove() {
    await setInterval( async () => {
      // one for reads all player matchMoves into the gameserivceTictactoeBoard
      // one for reads the current playerMove if matches the current tictactoe tile then sets its value
      // whoever is the last player that clicked will be placed on previousPlayer for checking on click
    }, 3000);
  }
  onClick() {
    // can only click if both player is ready
    // opponent is not ready then game cannot start
    // if host id is not ready then game cannot start
    // cannot click when current tile has value 
    // can only be clicked when previous player is not current player on storage


    // run uuid here who will turn first
    if (this.gameService.firstMove == "X" && 
    this.gameService.opponentPlayerUUID == " ") {
      if (localStorage.getItem("hostID")) {
        this.setPlayerMove();
      }
    }
    if (this.gameService.opponentPlayerUUID != " " && 
    this.gameService.firstMove) {
      // first check if has value already
      // if host player is different from old player in database then host turns
      this.setPlayerMove();
    }
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
