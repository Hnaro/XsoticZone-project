import { Component, OnInit } from '@angular/core';
import { RowsModel, Column } from '../../model/rowModel';

@Component({
  selector: 'app-tictactoe-game',
  templateUrl: './tictactoe-game.component.html',
  styleUrls: ['./tictactoe-game.component.css']
})
export class TictactoeGameComponent implements OnInit {
  // limit size of 8 for the boxes of tic tac toe
  test: string = "";
  rowsModel: Array<RowsModel> = new Array<RowsModel>();

  ngOnInit(): void {
    // set an interval for checking opponents move
    // create an alternate turn
    // if current user has move then send it to database
    // check current user in database wait for opponents turn
    for (let i = 0; i < 3; i++) {
      let column: Column;
      let currRows: Array<Column> = new Array<Column>();
      // setup row names and sample output
      for (let j = 0; j < 3; j++) {
        column = {
          colName: "r"+(i+1)+"-"+"c"+(j+1),
          colOutput: ""
        }
        currRows.push(column);
      }
      this.rowsModel.push({
        rows: currRows
      })
    }
    console.log(this.rowsModel);
  }
  rowsSet(rmodelIndex: number, rowsIndex: number, playerMove: string) {
      this.rowsModel[rmodelIndex].rows[rowsIndex].colOutput = playerMove;
  }
  move(index: number, columnIndex: number ,m: string) {
    console.log(m);
    switch(index) {
      case 0:
          this.rowsSet(index,columnIndex,"O");
        break;
      case 1:
        this.rowsSet(index,columnIndex,"O");
        break;
      case 2:
        this.rowsSet(index,columnIndex,"O");
      break;
    }
    console.log(this.rowsModel);
  }
}
