import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LobbyComponent } from './pages/lobby/lobby.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'lobby',
    component: LobbyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
