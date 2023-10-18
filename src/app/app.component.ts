import { Component } from '@angular/core';
import { TictactoeGamecontrolService } from './services/tictactoe-gamecontrol.service';
import { BackendServiceService } from './services/backend-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(){
    localStorage.removeItem("seshID");
  }
}
