import { Injectable } from '@angular/core';
import { ColRowModel } from '../model/rowModel';

@Injectable({
  providedIn: 'root'
})
export class TictactoeGamecontrolService {

  private firstTurn: any | null;
  // track the data here
  // use this to track the current player and the enemy
  private currentPlayerBoardData: Array<ColRowModel>;
  private hostUUID: any | undefined;
  private hostName: string = " ";
  private sessionUUID: string = " ";
  private opponentName: string = " ";
  private opponentUUID: any | undefined;
  private currentPlayerChar: any;
  private winnerUUID: any | undefined;
  // if data is 1 then it is X
  // if data is 0 then it is 0
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
  constructor() {
    this.currentPlayerBoardData = new Array<ColRowModel>(9).fill({
      playerID: undefined,
      name: undefined,
      value: undefined
    });
  }
  setupCurrentPlayerData(hostID: string,
    hostName: string,
    sessionID: string,
    opponentName: string,
    oppponentID: string) {
    this.hostUUID = hostID;
    this.hostName = hostName;
    this.sessionUUID = sessionID;
    this.opponentName = opponentName;
    this.opponentUUID = oppponentID;
  }
  // set and get recentChar
  set firstMove(char: any) {
    this.firstTurn = char;
  }
  get firstMove() {
    return this.firstTurn;
  }
  // set and get winner
  set winner(playerID: string) {
    this.winnerUUID = playerID;
  }
  get winner() {
    return this.winnerUUID;
  }
  // session id get and set
  set sessionID(sessionID: string) {
    this.sessionUUID = sessionID;
  }
  get sessionID(){
    return this.sessionUUID;
  }
  // current player hostname
  set hostname(name: string) {
    this.hostName = name;
  }
  get hostname() {
    return this.hostName;
  }
  // opponent name
  set opponentname(name: string) {
    this.opponentName = name;
  }
  get opponentname() {
    return this.opponentName;
  }
  // if X or O
  set currplayerChar(char: string) {
    this.currentPlayerChar = char;
  }
  get currplayerChar() {
    return this.currentPlayerChar;
  }
  // get and set for curr player UUID
  set hostID(playerID: string) {
    this.hostUUID = playerID;
  }
  get hostID() {
    return this.hostUUID;
  }
  // get and set for challenger playerUUID
  set opponentPlayerUUID(opponent: string) {
    this.opponentUUID = opponent;
  }
  get opponentPlayerUUID() {
    return this.opponentUUID;
  }
  // curr player board data
  set currPlayerBoard(board: Array<ColRowModel>) {
    this.currentPlayerBoardData = board;
  }
  get currPlayerBoard() {
    return this.currentPlayerBoardData;
  }
  // check who will take first turn
  whoTakesFirstTurn() {
    return Math.round(Math.random());
  }
  // determines the winner
  checkForWinner(playerid: any) {
    // check each possible combination of who wins
    // check if 1 wins means X wins
    // check if 0 wins means O wins
    let currentWinner: any;
    let winner: any;
    currentWinner = this.winCombinations.forEach((indexesWinCombination, index) => {
      if (this.currentPlayerBoardData.at(indexesWinCombination[0])?.value == 1 &&
      this.currentPlayerBoardData.at(indexesWinCombination[1])?.value == 1 &&
      this.currentPlayerBoardData.at(indexesWinCombination[2])?.value == 1) {
        // if X wins
        winner = this.currentPlayerBoardData.at(index)?.playerID;
      }
      if (this.currentPlayerBoardData.at(indexesWinCombination[0])?.value == 0 &&
      this.currentPlayerBoardData.at(indexesWinCombination[1])?.value == 0 &&
      this.currentPlayerBoardData.at(indexesWinCombination[2])?.value == 0) {
        // if O wins
        winner = this.currentPlayerBoardData.at(index)?.playerID;
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
  // record the values
  private recordData(column: number,
    currentPlayerChar: any,
    indexes: any[], playerID: any, name: any) {
    // check which column
    for(let i = 0; i < 3; i++) {
      if (column == (i+1)) {
        if (playerID != this.opponentPlayerUUID) {
          this.currentPlayerBoardData.splice(indexes[i], 1, {
            playerID: playerID,
            name: name,
            value: 0
          });
        }

        if (playerID == this.opponentPlayerUUID) {
          this.currentPlayerBoardData.splice(indexes[i], 1, {
            playerID: playerID,
            name: name,
            value: 1
          });
        }
      }
    }
  }
  // track player move
  playerMove(row: any, column: any, currentPlayerChar: any, playerID: any) {
    // set name for record
    let boxLocName = "r"+row+"-"+"c"+column;
    switch(row) {
      case 1:
        let r1Indexes = [0,1,2];
        this.recordData(column, currentPlayerChar, r1Indexes, playerID, boxLocName);
        break;
      case 2:
        let r2Indexes = [3,4,5];
        this.recordData(column, currentPlayerChar, r2Indexes, playerID, boxLocName);
        break;
      case 3:
        let r3Indexes = [6,7,8];
        this.recordData(column, currentPlayerChar, r3Indexes, playerID, boxLocName);
        break;
    }
  }
}
