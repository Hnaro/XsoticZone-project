import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  t: any;
  constructor(private router: Router, private gameService: TictactoeGamecontrolService, private backendService: BackendServiceService) {
  }
  ngOnInit(): void {
    this.waitForTimeout()
    setInterval(() => {
      if (!localStorage.getItem("seshID")) {
        this.router.navigate(['/'])
      }
    }, 200)
  }
  waitForTimeout() {
    this.t = setTimeout(() => {
      location.reload();
    }, 2000);
    clearTimeout(this.t);
  }
  endSession() {
    this.backendService.endSesh(localStorage.getItem("seshID"))
    .then(body => {
      let subs = body.subscribe(value => {
        let obj: any;
        obj = value;
        if (obj.msg) {
          console.log(obj);
          location.reload();
        }
      })
    });
    localStorage.removeItem("seshID");
  }
}
