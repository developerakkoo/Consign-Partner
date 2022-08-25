import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAgentPageRoutingModule } from './register-agent-routing.module';

import { RegisterAgentPage } from './register-agent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterAgentPageRoutingModule
  ],
  declarations: [RegisterAgentPage]
})
export class RegisterAgentPageModule {}
