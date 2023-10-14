import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  defaultUrl: string = "http://10.0.0.51:3000/";
  constructor(private http: HttpClient) {}

  // check backend connection
  async checkBackend() {
    return await this.http.get(this.defaultUrl);
  }
  // player move
}
