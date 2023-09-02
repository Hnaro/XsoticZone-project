import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tictactoe-board',
  templateUrl: './tictactoe-board.component.html',
  styleUrls: ['./tictactoe-board.component.css']
})
export class TictactoeBoardComponent implements OnInit {
  rowCount = new Array(3);
  @Input() currentUser: string | undefined;
  @Input() currentUserUUID: any;
  constructor() {

  }

  ngOnInit(): void {
    
  }
}
