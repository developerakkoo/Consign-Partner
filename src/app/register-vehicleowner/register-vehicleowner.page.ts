import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register-vehicleowner',
  templateUrl: './register-vehicleowner.page.html',
  styleUrls: ['./register-vehicleowner.page.scss'],
})
export class RegisterVehicleownerPage implements OnInit {

  vehicleRegistrationForm: FormGroup;
  vehicleRef: AngularFirestoreCollection<any>;

  constructor(private formBuilder: FormBuilder,
              private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private modalController: ModalController,
              ) 
              {
                this.vehicleRef = this.afs.collection('VehicleOwner');

    this.vehicleRegistrationForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', Validators.required],
      mobile: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      name: ['', Validators.required],
      surname:['', Validators.required],
      flatNo: ['', [Validators.required]],
      apartmentAddress:['', [Validators.required, Validators.minLength(8)]],
      officeAddress:['',[Validators.required]]


    })
   }

  ngOnInit() {
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

  async presentSuccess(msg) {
    const alert = await this.alertController.create({
      header: 'Congratulations!',
      subHeader: 'You are successfully registered with us!',
      message: msg,
      buttons: [{
        text: "Okay",
        handler: () =>{
          this.modalController.dismiss();
        }
      }]
    });
  
    await alert.present();
  }



  async onSubmit(){
    let loading = await this.loadingController.create({
      message: "Registering user..."
    })
    await loading.present();
    this.auth.createUserWithEmailAndPassword(this.vehicleRegistrationForm.value.email, this.vehicleRegistrationForm.value.password)
    .then(async (user) =>{
      console.log(user.user.uid);
      this.vehicleRef.doc(user.user.uid).set(this.vehicleRegistrationForm.value).then(async (data) =>{
        await loading.dismiss();
        this.presentSuccess("");
      }).catch(async (error) =>{
        await loading.dismiss();
        this.presentError(error.message);
      })    
      
    }).catch(async (error) =>{
      console.log(error);
      await loading.dismiss();
      this.presentError(error.message);

      
    })
    console.log(this.vehicleRegistrationForm.value);

    
  }

}
