import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  url = '../../assets/data/events-mock.json';
 
  constructor(private http: HttpClient) { }

  getEvents(): Observable<MatchEvent[]> {
    return this.http.get<MatchEvent[]>(this.url);
  }
}

export interface MatchEvent {
  id: number;
  type: string;
  time: number;
}
