import { Component, OnInit } from '@angular/core';
import { RowsModel, Column } from '../../model/rowModel';
import { BackendServiceService } from 'src/app/services/backend-service.service';

@Component({
  selector: 'app-tictactoe-game',
  templateUrl: './tictactoe-game.component.html',
  styleUrls: ['./tictactoe-game.component.css']
})
export class TictactoeGameComponent implements OnInit {
  // limit size of 8 for the boxes of tic tac toe
  test: string = "";
  rowsModel: Array<RowsModel> = new Array<RowsModel>();

  // test data
  currentUser: string = "Arhon";
  currentCharacter: string = "O";

  constructor(private backendService: BackendServiceService) {}

  ngOnInit(): void {
    this.backendService.checkBackend().then(value => {
      let subs = value.subscribe(value => {
        console.log(value);
      })
      console.log(subs);

    }).catch(err => {
      console.log("err")
    })
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
  rowsSet(rmodelIndex: number, rowsIndex: number, currCharacter: string, playerMove: string) {
      this.rowsModel[rmodelIndex].rows[rowsIndex].colOutput = currCharacter;
      this.backendService.sendMatchMove(this.currentUser, playerMove).then(observe => {
        observe.subscribe(body => {
          console.log(body)
        })
      });
  }
  move(index: number, columnIndex: number ,m: string) {
    console.log(m);
    switch(index) {
      case 0:
          this.rowsSet(index,columnIndex, this.currentCharacter, m);
        break;
      case 1:
        this.rowsSet(index,columnIndex, this.currentCharacter, m);
        break;
      case 2:
        this.rowsSet(index,columnIndex,this.currentCharacter, m);
      break;
    }
    console.log(this.rowsModel);
  }
}
