import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TicTacToe';
  
  // current player session
  currentUser: string = "John";
  currentUserUUID: string = "testUUID";
  currentPlayerCharacter = "X";

  onCreateSession() {}
  onJoinSession() {}
}
