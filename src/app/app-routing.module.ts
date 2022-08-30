import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'register-agent',
    loadChildren: () => import('./register-agent/register-agent.module').then( m => m.RegisterAgentPageModule)
  },
  {
    path: 'register-company',
    loadChildren: () => import('./register-company/register-company.module').then( m => m.RegisterCompanyPageModule)
  },
  {
    path: 'register-vehicleowner',
    loadChildren: () => import('./register-vehicleowner/register-vehicleowner.module').then( m => m.RegisterVehicleownerPageModule)
  },
  {
    path: 'enquiry/:orderId/:value',
    loadChildren: () => import('./enquiry/enquiry.module').then( m => m.EnquiryPageModule)
  },
  {
    path: 'approved/:orderid',
    loadChildren: () => import('./approved/approved.module').then( m => m.ApprovedPageModule)
  },
  {
    path: 'biling',
    loadChildren: () => import('./biling/biling.module').then( m => m.BilingPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
