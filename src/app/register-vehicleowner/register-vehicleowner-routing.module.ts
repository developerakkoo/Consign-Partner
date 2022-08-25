import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterVehicleownerPage } from './register-vehicleowner.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterVehicleownerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterVehicleownerPageRoutingModule {}
