import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  defaultUrl: string = "http://10.0.0.51:4000/";
  constructor(private http: HttpClient) {}

  // check backend connection
  async checkBackend() {
    return await this.http.get(this.defaultUrl);
  }
  // updates reload status
  async updateReloadStatus(sessionID: any) {
    return await this.http.post(this.defaultUrl+"t/updatesessionReloadStatus", {
      sessionUUIDSeed: sessionID
    });
  }
  // update session turn
  async updateSessionTurn(sessionID: any, sessionTurnID: any) {
    return await this.http.post(this.defaultUrl+"t/updateSessionTurn", {
      sessionUUIDSeed: sessionID,
      sessionTurnID: sessionTurnID
    });
  }
  // update winner
  async updateWinner(sessionID: any, playerID: any) {
    return await this.http.post(this.defaultUrl+"t/updateSessionWinner", {
      sessionUUIDSeed: sessionID,
      winnerUUIDSeed: playerID
    })
  }
  // get player move
  async getPlayerMatchMove(sessionID: any) {
    return await this.http.post(this.defaultUrl+"t/getMatch", {
      sessionUUIDSeed: sessionID
    });
  }
  // restart match
  async restartMatch(sessionID: any) {
    return await this.http.post(this.defaultUrl+"t/restartMatch", {
      sessionUUIDSeed: sessionID
    })
  }
  // get playerMatch Status
  async getMatchStatus(sessionUUID: any, playerID: any) {
    return await this.http.post(this.defaultUrl+"t/getPlayerMatchStatus", {
      sessionUUIDSeed: sessionUUID,
      playerUUID: playerID
    });
  }
  // update player match
  async updateMatchStatus(playerUUID: any, sessionUUID: any, matchStatus?: any) {
    return await this.http.post(this.defaultUrl+"t/updateMatchStatus", {
      sessionUUIDSeed: sessionUUID,
      playerUUID: playerUUID,
      playerStatus: matchStatus
    });
  }
  // player move
  async currentplayerMove(playerID: any, sessionID: any, playerMove: string) {
    return await this.http.post(this.defaultUrl+"t/playerMove", {
      playerUUID: playerID,
      sessionUUIDSeed: sessionID,
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
