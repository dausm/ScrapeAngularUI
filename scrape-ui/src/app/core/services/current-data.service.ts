import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentDataService {

  constructor(private readonly http: HttpClient) { }

  baseUrl: string = "https://localhost:44362";

  getCurrentDayData(){
    return this.http.get(`${this.baseUrl} + "/api/Averages/current-day"`);
  }
}
