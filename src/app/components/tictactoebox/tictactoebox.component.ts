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
    this.gameService.playerChar = "O";
  }
  ngOnInit(): void {
    // default is X first

  }
  onClick() {
    // first check if has value already
    if (!this.value && this.gameService.checkForWinner() == undefined) {
      if (this.gameService.playerChar == "X") {
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.playerChar);
        this.gameService.playerChar = "O";
      } else {      
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.playerChar);
        this.gameService.playerChar = "X"; 
      }
      this.value = this.gameService.playerChar;
      if (this.gameService.checkForWinner()){
        console.log("winner from tictactoe box message!! "+this.gameService.checkForWinner()+" wins!!");
      } 
    }
  }
}
