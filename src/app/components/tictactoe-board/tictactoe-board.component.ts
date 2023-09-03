import { Component, OnInit, Input } from '@angular/core';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-tictactoe-board',
  templateUrl: './tictactoe-board.component.html',
  styleUrls: ['./tictactoe-board.component.css'],
  providers: [TictactoeGamecontrolService]
})
export class TictactoeBoardComponent implements OnInit {
  // I used the empty row array to generate row and column easily
  rowCount = new Array(3);

  // current user info's
  @Input() currentUser: string | undefined;
  @Input() currentUserUUID: any;
  @Input() currentPlayerCharacter: string | undefined;

  // gameservice for controlling the game mechanics
  constructor(gameService: TictactoeGamecontrolService) {}
  ngOnInit(): void {
    console.log("current player info: \n player name: "
    +this.currentUser+"\n player UUID: "+
    this.currentUserUUID+"\n"+"playerCharacter: "+this.currentPlayerCharacter)
  }
}
