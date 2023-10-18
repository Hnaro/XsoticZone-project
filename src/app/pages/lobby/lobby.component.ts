import { Component, OnInit } from '@angular/core';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private gameService: TictactoeGamecontrolService) {}
  ngOnInit(): void {
    console.log("current hostname: "+this.gameService.hostname);
    console.log("current sessionID: "+localStorage.getItem("seshID"));
  }
}
