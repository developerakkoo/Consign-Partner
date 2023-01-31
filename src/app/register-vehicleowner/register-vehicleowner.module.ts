import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterVehicleownerPageRoutingModule } from './register-vehicleowner-routing.module';

import { RegisterVehicleownerPage } from './register-vehicleowner.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GooglePlaceModule,
    RegisterVehicleownerPageRoutingModule
  ],
  declarations: [RegisterVehicleownerPage]
})
export class RegisterVehicleownerPageModule {}
