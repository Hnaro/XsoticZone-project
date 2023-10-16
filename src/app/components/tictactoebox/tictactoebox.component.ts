import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(private gameService: TictactoeGamecontrolService){
    this.gameService.currplayerChar = "O";
  }
  ngOnInit(): void {
    // default is X first

  }
  onClick() {
    // first check if has value already
    if (!this.value && this.gameService.checkForWinner() == undefined) {
      if (this.gameService.currplayerChar == "X") {
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.currplayerChar);
        this.gameService.currplayerChar = "O";
      } else {
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.currplayerChar);
        this.gameService.currplayerChar = "X";
      }
      this.value = this.gameService.currplayerChar;
      if (this.gameService.checkForWinner()){
        console.log("winner from tictactoe box message!! "+this.gameService.checkForWinner()+" wins!!");
      }
    }
  }
}
