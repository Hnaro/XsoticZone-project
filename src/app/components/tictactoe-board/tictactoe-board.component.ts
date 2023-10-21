import { Component, OnInit, Input, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-tictactoe-board',
  templateUrl: './tictactoe-board.component.html',
  styleUrls: ['./tictactoe-board.component.css']
})
export class TictactoeBoardComponent implements OnInit {
  // I used the empty row array to generate row and column easily
  colCount = new Array(3);
  // gameservice for controlling the game mechanics
  constructor(private gameService: TictactoeGamecontrolService) {}
  ngOnInit(): void {}
}
