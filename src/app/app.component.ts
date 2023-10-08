import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { TictactoeGamecontrolService } from './services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck{
  title = 'TicTacToe';
  
  // current player session
  currentUser: string = "John";
  currentUserUUID: string = "testUUID";
  currentPlayerCharacter = "X";

  i: any;

  @Input() anyWinner: any;

  constructor(private gameService: TictactoeGamecontrolService) {
  }
  ngOnInit(): void {
    let x = 0;
/*     this.i = setInterval(() => {
        console.log(this.gameService.checkForWinner());
         if (this.gameService.checkForWinner()) {
          clearInterval(this.i);
        } 
    }, 3000); */
  }

  ngDoCheck(): void {
    console.log("new change: "+this.anyWinner);
  }

  onCreateSession() {
    console.log("create session clicked")
  }
  onJoinSession() {
    console.log("Join session clicked")
  }
}
