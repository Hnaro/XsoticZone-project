import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tictactoebox',
  templateUrl: './tictactoebox.component.html',
  styleUrls: ['./tictactoebox.component.css']
})
export class TictactoeboxComponent {
  @Input() rowId: number | undefined;
  @Input() value: string = "";

  onClick() {
    
  }
}