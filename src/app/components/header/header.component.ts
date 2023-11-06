import { Component, DoCheck, EventEmitter, Output } from '@angular/core';
import { BackendServiceService } from 'src/app/services/backend-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements DoCheck{
  sessionActive: any;
  // check here if gamecontrolService has Session UUID
  // then set session active to true if session is created
  // current user 
  localUser: any;
  @Output() refreshPage = new EventEmitter();
  constructor(private backendService: BackendServiceService) {}
  ngDoCheck(): void {
    if (localStorage.getItem("seshID") || localStorage.getItem("currentUserID")) {
      this.sessionActive = true;
      this.localUser = localStorage.getItem("localUser");
    }
  }
  refresh(){
    this.refreshPage.emit(true);
  }
}
