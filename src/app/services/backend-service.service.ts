import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  defaultUrl: string = "http://10.0.0.51:3000/";
  constructor(private http: HttpClient) {}

  async checkBackend() {
    return await this.http.get(this.defaultUrl);
  }

  async sendMatchMove(name: string, playerMove: string) {
    return await this.http.post(this.defaultUrl+"xzone/matchMove", { playerName: name, move: playerMove})
  }
}
