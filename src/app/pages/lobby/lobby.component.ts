import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  t: any;
  // only for player who will join
  isHostActive: boolean = false;
  // display lobby info property
  sessionID: any;
  hostname: string | undefined;
  opponentName: string | undefined;
  opponentSeshID: any;
  // check if another player joined
  isOpponentJoin: boolean | undefined;
  isGameStarted: any;
  i: any;
  @Input() waitMessage: any | undefined;
  winner: any | undefined;
  constructor(private router: Router, private gameService: TictactoeGamecontrolService, private backendService: BackendServiceService) {
  }

  ngOnInit(): void {
    // set who is currently in this session
    if (localStorage.getItem("hostID")) {

    } 
    
    if (localStorage.getItem("currentUserID")) {

    }

    this.i = setInterval(() => {
      if (this.gameService.checkForWinner(localStorage.getItem("currentUserID"))) {
        this.gameService.winner = this.gameService.checkForWinner(localStorage.getItem("hostID"));
        this.backendService.updateWinner(localStorage.getItem("seshID"), this.gameService.winner)
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            this.waitMessage = "winner is: "+obj.winnerName;
          })
        });
      } else {
        if (this.gameService.opponentPlayerUUID) {
          this.backendService.getPlayerMatch(localStorage.getItem("seshID"))
          .then(body => {
            let subs = body.subscribe(value => {
              let obj: any;
              obj = value;
              if (localStorage.getItem("hostID") != obj.playerID) {
                this.waitMessage = "your turn..."
              }
              if (localStorage.getItem("currentUserID") != obj.playerID && !this.gameService.firstMove) {
                this.waitMessage = "your turn..."
              } else {
                if (localStorage.getItem("hostID")) {
                  this.waitMessage = "your turn..."
                }
              }

              if (localStorage.getItem("hostID")) {
                if (localStorage.getItem("hostID") == obj.playerID) {
                  this.waitMessage = "opponent's turn..";
                }
              }
              if (localStorage.getItem("currentUserID")) {
                if (localStorage.getItem("currentUserID") == obj.playerID){
                  this.waitMessage = "opponent's turn..";
                }
              }
            })
          })
        }
      }
    }, 2000);
    if (localStorage.getItem("hostID") && localStorage.getItem("seshID")){
      this.isHostActive = true;
      this.sessionID = localStorage.getItem("seshID");
      this.backendService.findSesh(
        localStorage.getItem("seshID"))
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            this.hostname = obj.data.hostName;
          })
        })
    }
    if (localStorage.getItem("seshID")) {
      // looking for opponent
      setInterval(() => {
        this.backendService.findSesh(localStorage.getItem("seshID"))
        .then(body => {
          let subs = body.subscribe(value => {
            let obj: any;
            obj = value;
            if (obj.data.opponentName && obj.data.opponentID) {
              this.gameService.opponentname = obj.data.opponentName;
              this.gameService.opponentPlayerUUID = obj.data.opponentID;
              this.isOpponentJoin = true;
              this.opponentName = this.gameService.opponentname;
              this.opponentSeshID = obj.data.sessionID;
              this.sessionID = localStorage.getItem("seshID");
              this.hostname = obj.data.hostName;
              subs.unsubscribe();
            }
          });
        })
      }, 1000);
    }
    setInterval(() => {
      if (!localStorage.getItem("seshID")) {
        this.router.navigate(['/'])
      }
    }, 200);
  }
  endSession() {
    this.backendService.endSesh(localStorage.getItem("seshID"))
    .then(body => {
      let subs = body.subscribe(value => {
        let obj: any;
        obj = value;
        if (obj.msg) {
          console.log(obj);
          location.reload();
        }
      })
    });
    localStorage.removeItem("hostID");
    localStorage.removeItem("currentUserID");
    localStorage.removeItem("seshID");
  }
  onStart(){
    // if opponent is ready
    // update the match data 
  }
  onReady() {
    // when opponent is ready
  }
}
