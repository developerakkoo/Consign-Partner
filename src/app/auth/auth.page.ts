import { DataService } from './../services/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RegisterCompanyPage } from './../register-company/register-company.page';
import { RegisterVehicleownerPage } from './../register-vehicleowner/register-vehicleowner.page';
import { RegisterAgentPage } from './../register-agent/register-agent.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  email: string;
  password: string;

  type: string = "vehicle";

  isAgentSelected: boolean= false;
  isCompanySelected: boolean = false;
  isVehicleOwnerSelected: boolean = true;

  constructor(private router: Router,
              private toastController: ToastController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private auth: AngularFireAuth,
              private data: DataService) { }

  ngOnInit() {
  }
  ionViewDidEnter(){
    // this.checkForLoginDetails();
  }
  async presentError(msg) {
    const alert = await this.alertController.create({
      header: 'Error occured!',
      subHeader: 'Something went wrong!',
      message: msg,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  async checkForLoginDetails(){
    let email = await this.data.get("email");
    let password = await this.data.get("password");

    if(email != null && password != null){
      console.log("saved data");
      this.email = email;
      this.password = password;
      this.onLogin();
      return;
    }

    console.log("no saved data");
    
  }

  async onLogin(){
    let loading = await this.loadingController.create({
      message: "Logging you in..."
    })
    await loading.present();
    console.log("Login");
    this.auth.signInWithEmailAndPassword(this.email, this.password)
    .then(async (user) =>{
      await this.data.set("userid", user.user.uid);
      await this.data.set('usertype', this.type);
      await this.data.set("email", this.email);
      await this.data.set("password", this.password);
      await loading.dismiss();
      this.router.navigate(['folder']);

    }).catch(async (error) =>{
      await loading.dismiss();
      this.presentError(error.message);

    })

  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    if(ev.detail.value === "agent"){
      this.type = "agent";
      this.isAgentSelected = true; 
      this.isCompanySelected = false;
      this.isVehicleOwnerSelected = false;

    }
    if(ev.detail.value === "company"){
      this.type = "company";
      this.isAgentSelected = false; 
      this.isCompanySelected = true;
      this.isVehicleOwnerSelected = false;
    }

    if(ev.detail.value === "vehicle"){

      this.type = "vehicle";
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
    backdropDismiss: true,
    canDismiss: true,
    
    componentProps: { value: 123 }
    });
  
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    
  
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
