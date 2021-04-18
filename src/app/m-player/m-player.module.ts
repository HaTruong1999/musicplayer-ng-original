import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PlayerRoutingRoutingModule } from './player-routing-routing.module';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { MPlayerComponent } from './player.component';



@NgModule({
  declarations: [
    MPlayerComponent,
    NowPlayingComponent,
    PlaylistComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingRoutingModule
  ],
  bootstrap: [MPlayerComponent]
})
export class MPlayerModule { }
