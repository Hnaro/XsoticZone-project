import { Component, Input } from '@angular/core';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    // set the in game info about the session here!!
    title = 'TicTacToe';
    i: any;
    @Input() anyWinner: any;

    constructor(private backendService: BackendServiceService, private gameService: TictactoeGamecontrolService) {
    }
    ngOnInit(): void {
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
       this.i = setInterval(() => {
          //console.log(this.gameService.checkForWinner());
           if (this.gameService.checkForWinner()) {
            this.anyWinner = this.gameService.checkForWinner();
            clearInterval(this.i);
          }
      }, 200);

  /*
    ngDoCheck(): void {
      console.log("new change: "+this.anyWinner);
    } */

    }
    onCreateSession() {
      console.log("create session clicked")
    }
    onJoinSession() {
      console.log("Join session clicked")
    }

}
