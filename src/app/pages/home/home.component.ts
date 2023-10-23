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
    }
}
