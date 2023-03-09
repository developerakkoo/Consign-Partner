import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxinvoicePage } from './taxinvoice.page';

const routes: Routes = [
  {
    path: '',
    component: TaxinvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxinvoicePageRoutingModule {}
