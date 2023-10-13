import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { TictactoeGamecontrolService } from './services/tictactoe-gamecontrol.service';
import { BackendServiceService } from './services/backend-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'TicTacToe';
  
  // current player session
  currentUser: string = "John";
  currentUserUUID: string = "testUUID";
  currentPlayerCharacter = "X";

  i: any;

  @Input() anyWinner: any;

  constructor(private backendService: BackendServiceService, private gameService: TictactoeGamecontrolService) {
  }
  ngOnInit(): void {
    console.log(this.gameService.whoTakesFirstTurn());
    this.backendService.checkBackend().then(obj => {
      const subsObj = obj.subscribe(value => {
        let myval: any = {
          responseStatus: ""
        }
        myval = value;
      console.log(myval.responseStatus);
        if (value) {
          // after subscribing to the promise object unsubscribe it always
          subsObj.unsubscribe();
        }
      });
    }, )
    let x = 0;
/*     this.i = setInterval(() => {
        console.log(this.gameService.checkForWinner());
         if (this.gameService.checkForWinner()) {
          clearInterval(this.i);
        } 
    }, 3000); */
  }
/* 
  ngDoCheck(): void {
    console.log("new change: "+this.anyWinner);
  } */

  onCreateSession() {
    console.log("create session clicked")
  }
  onJoinSession() {
    console.log("Join session clicked")
  }
}
