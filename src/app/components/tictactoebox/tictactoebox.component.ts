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

  constructor(private gameService: TictactoeGamecontrolService){
    this.gameService.playerChar = "O";
  }
  ngOnInit(): void {
    // default is X first
  }
  onClick() {
    if (!this.value) {
      if (this.gameService.playerChar == "X") {
        console.log(this.gameService.playerChar)
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.playerChar);
        this.gameService.playerChar = "O";
      } else {
        console.log(this.gameService.playerChar)       
        this.gameService.playerMove(this.rowId, this.colId, this.gameService.playerChar);
        this.gameService.playerChar = "X"; 
      }
      this.value = this.gameService.playerChar;
      console.log(this.gameService.tictactoeRecs.values());
    }
    this.gameService.checkForWinner()
  }
}
