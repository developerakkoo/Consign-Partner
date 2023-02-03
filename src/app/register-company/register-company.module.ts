import { NgOtpInputModule } from 'ng-otp-input';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterCompanyPageRoutingModule } from './register-company-routing.module';

import { RegisterCompanyPage } from './register-company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgOtpInputModule,
    GooglePlaceModule,
    RegisterCompanyPageRoutingModule
  ],
  declarations: [RegisterCompanyPage]
})
export class RegisterCompanyPageModule {}
