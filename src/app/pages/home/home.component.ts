import { Component, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    // set the in game info about the session here!!
    title = 'TicTacToe';
    i: any;
    @Input() anyWinner: any;

    constructor(private router: Router,
      private backendService: BackendServiceService,
      private gameService: TictactoeGamecontrolService) {}
    ngOnInit(): void {
        // checks if current page has an active session to reroute
        // to the lobby
        let i = setInterval(() => {
          this.checkIfCurrentSessionActive(i);
        }, 1000);
    }
    private checkIfCurrentSessionActive(i: any) {
      if (localStorage.getItem("seshID")) {
        this.router.navigate(['/lobby'])
        clearInterval(i);
      }
    }
}
