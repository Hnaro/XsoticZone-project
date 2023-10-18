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
}
