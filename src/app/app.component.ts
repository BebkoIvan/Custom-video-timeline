import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { EventsApiService } from './services/events-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'video-playback';
  videoSrc = 'https://cfvod.kaltura.com/pd/p/2260701/sp/226070100/serveFlavor/entryId/1_xvuh31sc/v/11/ev/3/flavorId/1_q29kst4b/fileName/video-mock_(Source).mp4/name/a.mp4';
  videoNativeElement: HTMLVideoElement;
  currentTime = 0;
  matchEvents$ = this.evApi.getEvents();
  @ViewChild('videoPlayer') videoplayer: ElementRef<HTMLVideoElement>;

  constructor(private evApi: EventsApiService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.videoplayer.nativeElement.oncanplay = (ev) => {
      this.videoNativeElement = this.videoplayer.nativeElement;
    };
  }

  setCurrentTime(data) {
    this.currentTime = data.target.currentTime;
 }


}
