import { animate, AnimationPlayer, style } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationBuilder } from '@angular/animations';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Song } from 'src/app/_models/song';
import { SongService } from 'src/app/_services/song.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.sass'],
})
export class NowPlayingComponent implements OnInit {
  @ViewChild('audio') audio?: ElementRef;
  @ViewChild('progressBar') progressbard?: ElementRef;
  @ViewChild('vinyl') vinyl?: ElementRef;
  @ViewChild('cd') cd?: ElementRef;
  @ViewChild('btnVolume') btnVolume?: ElementRef;
  @ViewChild('volumeBarValue') volumeBarValue?: ElementRef;
  @ViewChild('volumeBar') volumeBar?: ElementRef;
  @ViewChild('volumeIcon') volumeIcon?: ElementRef;

  selectedSong?: Song;
  isPlaying: boolean = false;
  isRepeat: boolean = false;
  isRandom: boolean = false;
  progress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  progressWidth: number = 0;
  player?: AnimationPlayer;
  scrollTop: number = 0;

  constructor(
    private songService: SongService,
    private builder: AnimationBuilder
  ) {
    this.songService.getSelectedSong?.subscribe(
      (song) => {
        this.selectedSong = song;
        this.progress.next(0);
        this.player?.reset();
        this.isPlaying = false;
      },
      (error) => console.error(error.message)
    );
  }

  ngOnInit(): void {
    this.isRepeat = localStorage.getItem('isRepeat') === "true" ? true : false;
    this.isRandom = localStorage.getItem('isRandom') === "true" ? true : false;
  }

  ngAfterViewInit() {
    const PROGRESSEL = this.progressbard?.nativeElement;
    const CD_EL = this.cd?.nativeElement;
    const cdWidth = CD_EL.offsetWidth;
    let self = this;

    this.progress.subscribe(
      (progress) =>
      (this.progressWidth = Math.floor(
        (PROGRESSEL.offsetWidth * progress) / 100
      ))
    );

    this.player = this.builder
      .build([animate(10000, style({
        transform: 'rotate(360deg)',
      }))])
      .create(this.vinyl?.nativeElement);//chain function call

    this.player.onDone(onDone);

    function onDone() {
      self.player?.reset();
      self.player?.play();
      self.player?.onDone(onDone);
    }

    fromEvent(window, 'scroll').subscribe(e => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      CD_EL.style.opacity = newCdWidth / cdWidth;
      CD_EL.style.width = newCdWidth > 0 ? newCdWidth + "px" : cdWidth;
    });
  }

  onPlay(): void {
    const AUDIOEL = this.audio?.nativeElement;

    if (this.isPlaying) {
      AUDIOEL.pause();
      this.player?.pause();
    }
    else {
      AUDIOEL.play();
      this.player?.play();
    }

    this.isPlaying = !this.isPlaying;
  }

  onTimeUpdate(): void {
    const AUDIOEL = this.audio?.nativeElement;

    if (AUDIOEL.duration) {
      this.progress.next(
        Math.floor((AUDIOEL.currentTime / AUDIOEL.duration) * 100)
      );
    }

    if (this.progress.value === 100) {
      if (this.isRepeat) {
        this.selectedSong = this.selectedSong;
        AUDIOEL.play();
        this.player?.play();
      } else {
        this.songService.nextSong(this.selectedSong?.id as number, this.isRandom);
      }
    }
  }

  onChangeProgress(event: Event): void {
    const AUDIOEL = this.audio?.nativeElement,
      TARGET = event.target as HTMLInputElement;

    AUDIOEL.currentTime = (AUDIOEL.duration / 100) * Number(TARGET.value);

    this.progress.next(
      Math.floor((AUDIOEL.currentTime / AUDIOEL.duration) * 100)
    );
  }

  onNextSong(): void {
    this.songService.nextSong(this.selectedSong?.id as number, this.isRandom);
  }

  onPrevSong(): void {
    this.songService.prevSong(this.selectedSong?.id as number, this.isRandom);
  }

  onMouseOverBtnVolume(): void {
    const VOLUME_BAR_VALUE_EL = this.volumeBarValue?.nativeElement;
    const VOLUME_BAR_EL = this.volumeBar?.nativeElement;
    const VOLUME_ICON_EL = this.volumeIcon?.nativeElement;
    VOLUME_BAR_VALUE_EL.style.display = 'block';
    VOLUME_BAR_EL.style.display = 'block';
    VOLUME_ICON_EL.style.color = '#ec1f55';
  }

  onMouseOutBtnVolume(): void {
    const VOLUME_BAR_VALUE_EL = this.volumeBarValue?.nativeElement;
    const VOLUME_BAR_EL = this.volumeBar?.nativeElement;
    const VOLUME_ICON_EL = this.volumeIcon?.nativeElement;
    VOLUME_BAR_VALUE_EL.style.display = 'none';
    VOLUME_BAR_EL.style.display = 'none';
    VOLUME_ICON_EL.style.color = '#333';
  }

  onChangeVolume(event: Event): void {
    const VOLUME_BAR_VALUE_EL = this.volumeBarValue?.nativeElement;
    const VOLUME_BAR_EL = this.volumeBar?.nativeElement;
    const AUDIOEL = this.audio?.nativeElement,
      TARGET = event.target as HTMLInputElement;

    AUDIOEL.volume = VOLUME_BAR_EL.value / 100;
    VOLUME_BAR_VALUE_EL.style.width = Math.floor(VOLUME_BAR_EL.clientWidth * VOLUME_BAR_EL.value / 100) + "px"
  }

  onRepeat(): void {
    this.isRepeat = !this.isRepeat;
    localStorage.setItem("isRepeat", String(this.isRepeat));
  }

  onRandomSong(): void {
    this.isRandom = !this.isRandom;
    localStorage.setItem("isRandom", String(this.isRandom));
  }
}

