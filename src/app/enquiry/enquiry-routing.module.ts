import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnquiryPage } from './enquiry.page';

const routes: Routes = [
  {
    path: '',
    component: EnquiryPage
  },
  {
    path: 'enquiry-details',
    loadChildren: () => import('./enquiry-details/enquiry-details.module').then( m => m.EnquiryDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnquiryPageRoutingModule {}
