import { Injectable } from '@angular/core';
import { Song } from '../_models/song';
import { SONGS } from '../mock-song';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  selectedSong: BehaviorSubject<Song> = new BehaviorSubject({} as Song);

  constructor() {
    this.selectSong(SONGS[0]);
  }

  get getSongs(): Song[] {
    return SONGS;
  }

  selectSong(song: Song) {
    this.selectedSong.next(song);
  }

  nextSong(id: number, isRandom: boolean) {
    if (!isRandom) {
      this.selectedSong.next(SONGS[id] ?? SONGS[0]);
    } else {
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * SONGS.length)
      } while (newIndex === id - 1)
      this.selectedSong.next(SONGS[newIndex]);
    }
  }

  prevSong(id: number, isRandom: boolean) {
    if (!isRandom) {
      this.selectedSong.next(SONGS[id - 2] ?? SONGS[SONGS.length - 1]);
    } else {
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * SONGS.length)
      } while (newIndex === id - 1)
      this.selectedSong.next(SONGS[newIndex]);
    }
  }

  get getSelectedSong(): BehaviorSubject<Song> {
    return this.selectedSong;
  }
}
