import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAgentPageRoutingModule } from './register-agent-routing.module';

import { RegisterAgentPage } from './register-agent.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgOtpInputModule } from 'ng-otp-input';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgOtpInputModule,
    GooglePlaceModule,
    RegisterAgentPageRoutingModule
  ],
  declarations: [RegisterAgentPage]
})
export class RegisterAgentPageModule {}
