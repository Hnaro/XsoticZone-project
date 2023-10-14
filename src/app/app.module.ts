import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { BackendServiceService } from './services/backend-service.service';
import { HeaderComponent } from './components/header/header.component';
import { TictactoeBoardComponent } from './components/tictactoe-board/tictactoe-board.component';
import { TictactoeboxComponent } from './components/tictactoebox/tictactoebox.component';
import { TictactoeGamecontrolService } from './services/tictactoe-gamecontrol.service';
import { CreateSessionCompComponent } from './components/create-session-comp/create-session-comp.component';
import { JoinSessionCompComponent } from './components/join-session-comp/join-session-comp.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TictactoeBoardComponent,
    TictactoeboxComponent,
    CreateSessionCompComponent,
    JoinSessionCompComponent,
    LobbyComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [BackendServiceService, TictactoeGamecontrolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
