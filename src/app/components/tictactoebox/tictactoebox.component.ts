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
  @Output() outputWinner = new EventEmitter();
  constructor(private gameService: TictactoeGamecontrolService, private backendService: BackendServiceService){}
  ngOnInit(): void {
    // default is X first
    // create set Interval here that reads value all the time in the game
    this.checkPlayerMove()
    // host is X other player is O
    if (localStorage.getItem("hostID")) {
      this.gameService.currplayerChar = "X";
    } else {
      this.gameService.currplayerChar = "O";
    }
  }
  async checkPlayerMove() {
    await setInterval( async () => {
      let currentBoxLoc = "r"+this.rowId+"-"+"c"+this.colId;
      await this.backendService.getPlayerMove(localStorage.getItem("seshID"))
      .then( body => {
      let subs = body.subscribe(async value => {
        let obj: any;
        obj = value;
        if (localStorage.getItem("currentUserID")) {
          if (obj.playerMove == currentBoxLoc && localStorage.getItem("currentUserID") != obj.playerID) {
            this.value = "X";
          }
        }
        if (localStorage.getItem("hostID")) {
          if (obj.playerMove == currentBoxLoc && localStorage.getItem("hostID") != obj.playerID) {
            this.value = "O";
          }
        }
        subs.unsubscribe();
      });
    })
    }, 3000);
  }
  onClick() {
    // first check if current session is host if no host means its opponent
    if (this.gameService.opponentPlayerUUID != " ") {
      // first check if has value already
      if (!this.value && this.gameService.checkForWinner() == undefined) {
        // record game player moves to memory which is tictactoe board
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.currplayerChar);
        this.value = this.gameService.currplayerChar;
        // send player move to the server
        let currplayerMove = "r"+this.rowId+"-"+"c"+this.colId;
        let currentPlayerID = localStorage.getItem("hostID") ? localStorage.getItem("hostID") : this.gameService.opponentPlayerUUID;
        console.log(currentPlayerID);
        this.backendService.currentplayerMove(currentPlayerID, localStorage.getItem("seshID"), currplayerMove)
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            console.log(obj);
          });
        });
        // checks each time if there is a winner in the board
        if (this.gameService.checkForWinner()){
          console.log("winner from tictactoe box message!! "+this.gameService.checkForWinner()+" wins!!");
        }
      }
    }
  }
}
