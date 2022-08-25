import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAgentPage } from './register-agent.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAgentPageRoutingModule {}
