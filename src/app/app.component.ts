import { Component, OnInit } from '@angular/core';
import { TictactoeGamecontrolService } from './services/tictactoe-gamecontrol.service';
import { BackendServiceService } from './services/backend-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  i: any;
  isStorageDeleted: boolean = false;
  isWindowReloaded: boolean = false;
  constructor(private backendService: BackendServiceService){
  }
  ngOnInit(): void {
    // check if current id session is still in database
    let i = setInterval(() => {
      if (localStorage.getItem("seshID")) {
        this.backendService.findSesh(localStorage.getItem("seshID"))
        .then(body => {
          body.subscribe(value => {
            let obj: any;
            obj = value;
            if (obj.delLocalStorage) {
              localStorage.removeItem("seshID");
       /*        location.reload(); */
              this.isStorageDeleted = true;
              console.log("storage deleted")
            } else {
              this.isWindowReloaded = true;
            }
            if (this.isStorageDeleted) {
              clearInterval(i);
              if (obj.delLocalStorage && this.isWindowReloaded) {
                this.isWindowReloaded = false;
                location.reload();
              }
            }
          })
        });
      }
      // if not then delete it
    }, 1000)
  }
  handleRefresh(e: any) {
    setTimeout(() => {
      location.reload();
    }, 200);
  }
}
