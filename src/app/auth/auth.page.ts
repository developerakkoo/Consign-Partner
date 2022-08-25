import { RegisterCompanyPage } from './../register-company/register-company.page';
import { RegisterVehicleownerPage } from './../register-vehicleowner/register-vehicleowner.page';
import { RegisterAgentPage } from './../register-agent/register-agent.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isAgentSelected: boolean= false;
  isCompanySelected: boolean = false;
  isVehicleOwnerSelected: boolean = true;

  constructor(private router: Router,
              private toastController: ToastController,
              private modalController: ModalController,
              private loadingController: LoadingController) { }

  ngOnInit() {
  }

  onLogin(){
    console.log("Login");
    this.router.navigate(['folder']);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    if(ev.detail.value === "agent"){

      this.isAgentSelected = true; 
      this.isCompanySelected = false;
      this.isVehicleOwnerSelected = false;

    }
    if(ev.detail.value === "company"){

      this.isAgentSelected = false; 
      this.isCompanySelected = true;
      this.isVehicleOwnerSelected = false;
    }

    if(ev.detail.value === "vehicle"){

      this.isAgentSelected = false; 
      this.isCompanySelected = false;
      this.isVehicleOwnerSelected = true;
    }
  }

  async presentAgentModal() {
    const modal = await this.modalController.create({
    component: RegisterAgentPage,
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
  }
  async presentVehicleOwnerModal() {
    const modal = await this.modalController.create({
    component: RegisterVehicleownerPage,
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
  }
  async presentCompanyModal() {
    const modal = await this.modalController.create({
    component: RegisterCompanyPage,
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
  }

  goToAgentRegister(){
    this.presentAgentModal();
  }

  goToVehicleOwnerRegister(){
    this.presentVehicleOwnerModal();
  }

  goToCompanyRegister(){
    this.presentCompanyModal();
  }

}
