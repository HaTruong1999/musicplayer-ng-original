import { Component, OnInit } from '@angular/core';
import { Song } from 'src/app/_models/song';
import { SongService } from 'src/app/_services/song.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.sass'],
})
export class PlaylistComponent implements OnInit {
  songs: Song[] = [];
  selectedSong?: Song;

  constructor(private songService: SongService) {
    this.songService.getSelectedSong?.subscribe(
      (song) => (this.selectedSong = song),
      (error) => console.error(error.message)
    );
  }

  ngOnInit(): void {
    this.songs = this.songService.getSongs;
  }

  onSelect(song: Song) {
    this.songService.selectSong(song);
  }
}
