import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TictactoeGamecontrolService {

  // track the data here
  // if data is 1 then it is X
  // if data is 0 then it is 0
  tictactoeBoard: number[];
  // win combinations
  winCombinations: Array<number>[] = [
    [0,1,2], 
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]];
    currentPlayerChar: any;
  constructor() {
    this.tictactoeBoard = new Array(8).fill(undefined);
  }
  get tictactoeRecs() {
    return this.tictactoeBoard;
  }
  set playerChar(char: string) {
    this.currentPlayerChar = char;
  }
  get playerChar() {
    return this.currentPlayerChar;
  }
  // determines the winner 
  checkForWinner() {
    // check each possible combination of who wins
    // check if 1 wins means X wins
    // check if 0 wins means O wins
    let currentWinner: any; 
    let winner: any;
    currentWinner = this.winCombinations.forEach((indexesWinCombination, index) => {
      if (this.tictactoeBoard[indexesWinCombination[0]] == 1 &&
        this.tictactoeBoard[indexesWinCombination[1]] == 1 &&
        this.tictactoeBoard[indexesWinCombination[2]] == 1 ) {
          winner = "X"
      }
      if (this.tictactoeBoard[indexesWinCombination[0]] == 0 &&
        this.tictactoeBoard[indexesWinCombination[1]] == 0 &&
        this.tictactoeBoard[indexesWinCombination[2]] == 0 ) {
          winner = "O"
      }
      if (!winner && index == 7) {
        return undefined;
      }
      if (winner && index == 7){
        return winner;
      }
    });
    return winner;
  }
  private checkColumn(column: number, 
    currentPlayerChar: string, 
    indexes: any[]) {
    // check which column 
    for(let i = 0; i < 3; i++) {
      if (column == (i+1)) {
        if (currentPlayerChar == "X") {
          this.tictactoeBoard[indexes[i]] = 0;
        } else {
          this.tictactoeBoard[indexes[i]] = 1;
        }
      } 
    }
  }
  // track player move
  playerMove(row: any, column: any, currentPlayerChar: any) {
    console.log("currentPlayerChar: "+currentPlayerChar);
    switch(row) {
      case 1:
        let r1Indexes = [0,1,2];
        this.checkColumn(column, currentPlayerChar, r1Indexes);
        break;
      case 2:
        let r2Indexes = [3,4,5];
        this.checkColumn(column, currentPlayerChar, r2Indexes);
        break;
      case 3:
        let r3Indexes = [6,7,8];
        this.checkColumn(column, currentPlayerChar, r3Indexes);
        break;
    }
  }
  // if there is a winner fill up the tictactoe board with number 2 value
}
