import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { TictactoeGameComponent } from './mini-games/tictactoe-game/tictactoe-game.component';
import { BackendServiceService } from './services/backend-service.service';

@NgModule({
  declarations: [
    AppComponent,
    TictactoeGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [BackendServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
