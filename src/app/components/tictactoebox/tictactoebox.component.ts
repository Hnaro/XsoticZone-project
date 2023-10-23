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
  constructor(private gameService: TictactoeGamecontrolService, private backendService: BackendServiceService){
  }
  ngOnInit(): void {
    // default is X first
    // create set Interval here that reads value all the time in the game
    if (localStorage.getItem("hostID")) {
      this.gameService.currplayerChar = "X";
    } else {
      this.gameService.currplayerChar = "O";
    }
    this.checkPlayerMove()
    // host is X other player is O
  }
  async checkPlayerMove() {
    await setInterval( async () => {
      // after sending part will continue to recieve data from the server
      let currentBoxLoc = "r"+this.rowId+"-"+"c"+this.colId; // r1-c1
      await this.backendService.getPlayerMatch(localStorage.getItem("seshID"))
      .then( body => {
      let subs = body.subscribe(async value => {
        let obj: any;
        obj = value;
        // record the data to gamecontrol service
        const moveLocName: string = obj.playerMove
        // convert the strings to number
        let currRowNum: number = Number.parseInt(moveLocName.substring(1, 2));
        let currColNum: number = Number.parseInt(moveLocName.substring(4));
        // record the data to the memory
        this.gameService.playerMove(currRowNum, currColNum, this.gameService.currplayerChar, obj.playerID);
        // if different then put value
        this.gameService.currPlayerBoard.map(rcObj => {
          const locName = "r"+this.rowId+"-"+"c"+this.colId;
          if (rcObj.name == locName) {
            if (rcObj.value == 0) {
              this.value = "X";
            }
            if (rcObj.value == 1) {
              this.value = "O";
            }
          }
        });
        subs.unsubscribe();
      });
    })
    }, 3000);
  }
  onClick() {
    // first check if current session is host if no host means its opponent
    if (this.gameService.opponentPlayerUUID != " ") {
      // first check if has value already
      // if host player is different from old player in database then host turns
      this.backendService.getPlayerMatch(localStorage.getItem("seshID"))
      .then(body => {
        let subs = body.subscribe(value => {
          let obj: any;
          obj = value;
          if (localStorage.getItem("hostID")) {
            if (localStorage.getItem("hostID") != obj.playerID) {
              this.setPlayerMove();
            } else {
              console.log("waiting for opponent move!!");
            }
          } else {
            if (localStorage.getItem("currentUserID") != obj.playerID){
              this.setPlayerMove();
            } else {
              console.log("waiting for host move!!");
            }
          }
        });
      })
    }
  }
  setPlayerMove() {
    if (!this.value && this.gameService.checkForWinner(localStorage.getItem("currentUserID")) == undefined) {
      // record game player moves to memory which is tictactoe board
      let currentPlayerID = localStorage.getItem("hostID") ? localStorage.getItem("hostID") : this.gameService.opponentPlayerUUID;
      this.gameService.playerMove(this.rowId, this.colId, this.gameService.currplayerChar, currentPlayerID);
      // sets trhe value for current tictactoe box
      this.value = this.gameService.currplayerChar;
      // sets the name for currPlayerLocation box
      let currplayerMove = "r"+this.rowId+"-"+"c"+this.colId;
      // send player move to the server
      // after recording data get each data and update the board
      // check if recent character is different from the database
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
