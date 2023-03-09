import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxinvoicePageRoutingModule } from './taxinvoice-routing.module';

import { TaxinvoicePage } from './taxinvoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxinvoicePageRoutingModule
  ],
  declarations: [TaxinvoicePage]
})
export class TaxinvoicePageModule {}
