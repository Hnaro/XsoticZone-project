import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { BackendServiceService } from './services/backend-service.service';
import { HeaderComponent } from './components/header/header.component';
import { TictactoeBoardComponent } from './components/tictactoe-board/tictactoe-board.component';
import { TictactoeboxComponent } from './components/tictactoebox/tictactoebox.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TictactoeBoardComponent,
    TictactoeboxComponent
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
