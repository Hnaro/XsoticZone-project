import { Component, DoCheck, EventEmitter, Output, OnInit } from '@angular/core';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements DoCheck, OnInit{
  sessionActive: any;
  // check here if gamecontrolService has Session UUID
  // then set session active to true if session is created
  // current user 
  localUser: any;
  // to change icon depends on the situation or on copy method
  icon: any;
  @Output() refreshPage = new EventEmitter();
  constructor(private backendService: BackendServiceService,
    private clipBoard: Clipboard) {}
  ngOnInit(): void {
    // default image
    this.icon = "../../../assets/images/clipBoardIcon.jpg"
  }
  ngDoCheck(): void {
    if (localStorage.getItem("seshID") || localStorage.getItem("currentUserID")) {
      this.sessionActive = true;
      this.localUser = localStorage.getItem("localUser");
    }
  }
  // copy the sessionID to clipboard
  onCopy() {
    if (localStorage.getItem("seshID")) {
      let seshID: any = localStorage.getItem("seshID")? localStorage.getItem("seshID") : "";
      this.clipBoard.copy(seshID); 
      this.icon = "../../../assets/images/checkIcon.jpg"
    }
  }
  refresh(){
    this.refreshPage.emit(true);
  }
}
