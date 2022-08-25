import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BilingPageRoutingModule } from './biling-routing.module';

import { BilingPage } from './biling.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BilingPageRoutingModule
  ],
  declarations: [BilingPage]
})
export class BilingPageModule {}
