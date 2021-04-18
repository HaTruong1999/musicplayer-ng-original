import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MPlayerComponent } from './player.component';

const routes: Routes = [{ path: '', component: MPlayerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingRoutingModule { }
