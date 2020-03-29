import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { EventsApiService } from './services/events-api.service';
import { map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'video-playback';
  videoSrc = 'https://cfvod.kaltura.com/pd/p/2260701/sp/226070100/serveFlavor/entryId/1_xvuh31sc/v/11/ev/3/flavorId/1_q29kst4b/fileName/video-mock_(Source).mp4/name/a.mp4';
  videoNativeElement: HTMLVideoElement;
  currentTime = 0;
  progress = 0;
  matchEvents$: Observable<any> = this.evApi.getEvents().pipe(
    map((events) => {
      return events.map(ev => ({
        type: ev.type[0].toUpperCase(),
        time: ev.time,
        color: this.getEventColor(ev.type),
        leftOffset: (ev.time / this.videoNativeElement.duration) * 100
      }));
    }),
    map((events) => (this.groupEvents(events))),
    untilDestroyed(this)
  );

  @ViewChild('videoPlayer') videoplayer: ElementRef<HTMLVideoElement>;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    switch (event.keyCode) {
      case KEY_CODE.RIGHT_ARROW:
        this.videoNativeElement.currentTime += 5;
        break;
      case KEY_CODE.LEFT_ARROW:
        this.videoNativeElement.currentTime -= 5;
        break;
      case KEY_CODE.SPACE:
        this.videoNativeElement.paused ? this.videoNativeElement.play() : this.videoNativeElement.pause();
        break;
      default:
        break;
    }

  }
  constructor(private evApi: EventsApiService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.videoplayer.nativeElement.oncanplay = (ev) => {
      this.videoNativeElement = this.videoplayer.nativeElement;
    };
  }

  private groupEvents(matchEvents): Array<any> {
    const newArr = [];
    matchEvents.forEach(( item, i) => {
      if (newArr[newArr.length - 1] && newArr[newArr.length - 1].group && (item.time - newArr[newArr.length - 1].events[0].time) < 50) {
        newArr[newArr.length - 1].events.push(item);
        matchEvents.splice(i, 1);
      }
      else if (newArr[newArr.length - 1] && (item.time - newArr[newArr.length - 1].time) < 50 ) {
        newArr[newArr.length - 1] = {group: true, showTooltip: false, events: [newArr[newArr.length - 1], item]};
        matchEvents.splice(i, 1);
      }
      else newArr.push(item);
    });
    return newArr;
  }

  goToEvent(ev) {
    this.videoNativeElement.currentTime = ev.time;
  }

  toggleTooltip(ev) {
    if (ev.group) ev.showTooltip = !ev.showTooltip;
  }

  setCurrentTime(data): void {
    this.currentTime = data.target.currentTime;
    this.progress = (this.currentTime / data.target.duration) * 100;
  }

  getEventColor(type: string): string {
    switch (type) {
      case 'kill':
        return 'green';
      case 'assist':
        return 'blue';
      case 'death':
        return 'red';
      default:
        break;
    }
  }

  ngOnDestroy() {}

}

enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  SPACE = 32
}

