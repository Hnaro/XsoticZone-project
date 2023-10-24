import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  defaultUrl: string = "http://35.183.127.219:4000/";
  constructor(private http: HttpClient) {}

  // check backend connection
  async checkBackend() {
    return await this.http.get(this.defaultUrl);
  }
  // update winner
  async updateWinner(sessionID: any, playerID: any) {
    return await this.http.post(this.defaultUrl+"t/sessionWinner", {
      sessionUUIDSeed: sessionID,
      winnerUUIDSeed: playerID
    })
  }
  // get player move
  async getPlayerMatch(sessionID: any) {
    return await this.http.post(this.defaultUrl+"t/getMatch", {
      sessionUUIDSeed: sessionID
    });
  }
  // player move
  async currentplayerMove(playerID: any, sessionID: any, playerMove: string) {
    return await this.http.post(this.defaultUrl+"t/playerMove", {
      playerUUID: playerID,
      sessionUUID: sessionID,
      playerMove: playerMove
    });
  }
  // create session
  async createSesh(hostname: any) {
    return await this.http.post(
      this.defaultUrl+"t/createSession",
      {hostName: hostname});
  }
  // join session
  async joinSesh(sessionID: any, name: any){
    return await this.http.post(
      this.defaultUrl+"t/joinSession",
      {sessionUUIDSeed: sessionID,
        opponentName: name}
    );
  }
  // look for session id
  async findSesh(sessionID: any) {
    return await this.http.post(this.defaultUrl+'t/findSession', {
      sessionUUIDSeed: sessionID
    });
  }
  // end session
  async endSesh(sessionID: any) {
    return await this.http.post(this.defaultUrl+"t/endSesh", {
      sessionUUIDSeed: sessionID
    })
  }
}
