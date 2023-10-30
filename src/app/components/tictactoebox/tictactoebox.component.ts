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

  firstTurn: any | undefined;
  constructor(private gameService: TictactoeGamecontrolService, private backendService: BackendServiceService){}

  ngOnInit(): void {
    // default is X first
    this.gameService.firstMove = "X";
    // create set Interval here that reads value all the time in the game
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
      // reads all player matchMoves
    }, 3000);
  }
  onClick() {
    // first check if current session is host if no host means its opponent
    // run uuid here who will turn first
    if (this.gameService.firstMove == "X" && this.gameService.opponentPlayerUUID == " ") {
      if (localStorage.getItem("hostID")) {
        this.setPlayerMove();
      }
    }
    if (this.gameService.opponentPlayerUUID != " " && this.gameService.firstMove) {
      // first check if has value already
      // if host player is different from old player in database then host turns
      this.setPlayerMove();
    }
  }

  private setPlayerMove() {
    if (!this.value && this.gameService.checkForWinner(localStorage.getItem("currentUserID")) == undefined) {

      // record game player moves to memory which is tictactoe board
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
