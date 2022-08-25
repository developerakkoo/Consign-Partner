import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BilingPage } from './biling.page';

const routes: Routes = [
  {
    path: '',
    component: BilingPage
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BilingPageRoutingModule {}
