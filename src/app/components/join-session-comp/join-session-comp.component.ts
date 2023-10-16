import { Component } from '@angular/core';
import { BackendServiceService } from 'src/app/services/backend-service.service';
import { TictactoeGamecontrolService } from 'src/app/services/tictactoe-gamecontrol.service';

@Component({
  selector: 'app-join-session-comp',
  templateUrl: './join-session-comp.component.html',
  styleUrls: ['./join-session-comp.component.css']
})
export class JoinSessionCompComponent {

  username: string | undefined;
  sessionIDSeed: string | undefined;
  // on join session
  constructor(private backendService: BackendServiceService,
    private gameControlService: TictactoeGamecontrolService) {}
  onJoin() {
    // send join info's
    this.backendService.joinSesh(this.sessionIDSeed,
      this.username)
      .then(data => {
        let subs = data.subscribe(value => {
          console.log(value);

        })
      })
  }
}
