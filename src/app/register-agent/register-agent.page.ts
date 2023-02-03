import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { passwordMatch } from './../validators/passwordMatch';
import { validateCallback } from '@firebase/util';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
@Component({
  selector: 'app-register-agent',
  templateUrl: './register-agent.page.html',
  styleUrls: ['./register-agent.page.scss'],
})
export class RegisterAgentPage implements OnInit {
  agentRegistrationForm: FormGroup;
  destinationForm: FormGroup;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options: Options;
  agentRef: AngularFirestoreCollection<any>;

  adharUrl;
  adharUrlSub;
  panUrl;
  panUrlSub;
  base64Image;

  adhar: FormControl;

  constructor(private fb: FormBuilder, private router: Router,
              private modalController: ModalController,
              private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private storage: AngularFireStorage) {
                this.agentRef = this.afs.collection('Agent');


    this.agentRegistrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(5)]],
      origin: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      name: ['', Validators.required],
      surname:['', Validators.required],
      adhar:['', [Validators.required, Validators.minLength(12)]],
      pan:['',[Validators.required, Validators.min(10)]],
      destination: this.fb.array([])


    });

    this.destinationForm = this.fb.group({
      destination: this.fb.array([])
    });
   }

  ngOnInit() {

  }
  close(){
    this.modalController.dismiss();
  }

  onOtpChangeA(ev){
    console.log(ev);
    this.agentRegistrationForm.patchValue({adhar:ev})
    
  }

  onOtpChangeP(ev){
    console.log(ev);
    this.agentRegistrationForm.patchValue({pan:ev})
    
  }

  passwordMatchingValidatior(form: FormGroup)  {
    const password = form.controls['password'].value;
    const confirmation = form.controls['confirmpassword'].value;

    if (!password || !confirmation) { // if the password or confirmation has not been inserted ignore
      return null;
    }
    
    if (confirmation.length > 0 && confirmation !== password) {
      confirmation.setErrors({ notMatch: true }); // set the error in the confirmation input/control
    }

    return null; // always return null here since as you'd want the error displayed on the confirmation input
 }


 public handleAddressChangeDestination(address: Address, i) {
  // Do some stuff
  console.log(address['formatted_address']);
  let add = address['address_components'];
  

  let formArr = <FormArray>this.agentRegistrationForm.get("destination");

  if(formArr.at(i)){
    formArr.at(i).patchValue({
      destination: address?.formatted_address
    })
  }
  else{
    formArr.push(this.fb.group({
      destination: address?.formatted_address
    }))
  }
  // this.agentRegistrationForm.get("destination").patchValue(address?.formatted_address)
  // this.agentRegistrationForm.patchValue({
  //   destination: address?.formatted_address
  // })
    



}

public handleAddressChange(address: Address) {
  // Do some stuff
  console.log(address['formatted_address']);
  let add = address['address_components'];
  

  this.agentRegistrationForm.get("origin").patchValue(address?.formatted_address)
  // this.agentRegistrationForm.patchValue({
  //   destination: address?.formatted_address
  // })
    



}
  get fields() {
    return this.agentRegistrationForm.get("destination") as FormArray;
  }

  newField(): FormGroup {
    return this.fb.group({
      destination: '',
    })
  }

  addQuantity() {
    const field = this.fb.group({
      destination: '',
    })
    this.fields.push(field);
  }

  removeQuantity(i: number) {
    this.fields.removeAt(i);
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
   
    let obj = {
      ...this.agentRegistrationForm.value,
      adharUrl: this.adharUrl,
      panUrl: this.panUrl,
      // key: user.user.uid,
    }
    console.log(obj);
    let loading = await this.loadingController.create({
      message: "Registering user..."
    })

    await loading.present();
    this.auth.createUserWithEmailAndPassword(this.agentRegistrationForm.value.email, this.agentRegistrationForm.value.password)
    .then(async (user) =>{
      console.log(user.user.uid);
      let obj = {
        ...this.agentRegistrationForm.value,
        adharUrl: this.adharUrl,
        panUrl: this.panUrl,
        key: user.user.uid,
      }
      console.log(obj);
      this.agentRef.doc(user.user.uid).set(obj).then(async (data) =>
      {
        await loading.dismiss();
        this.presentSuccess("");
      }).catch(async (error) =>
      {
        await loading.dismiss();
        this.presentError(error.message);
      })    
      
    }).catch(async (error) =>{
      console.log(error);
      await loading.dismiss();
      this.presentError(error.message);

      
    })
    
    
  }

  async uploadAdhar(ev){
    let loading = await this.loadingController.create({
      message: "Uploading file..."
    })
    await loading.present();
  
      var currentDate = Date.now();
      const file = ev.target.files[0];
      const filePath = `Images/${currentDate}`;
      const fileRef = this.storage.ref(filePath);
  
      const task = this.storage.upload(`Images/${currentDate}`, file);
      task.snapshotChanges()
        .pipe(finalize(async () => {
            this.adharUrlSub = fileRef.getDownloadURL();
            this.adharUrlSub.subscribe(async downloadURL => {
              if (downloadURL) {
                this.showSuccesfulUploadAlertAdhar();
                await loading.dismiss();
                this.adharUrl = downloadURL;
              }
              console.log(downloadURL);
            });
          
        })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
            // this.UrlOne = url;
          }
        });
    }

    async uploadPan(ev){
      let loading = await this.loadingController.create({
        message: "Uploading file..."
      })
      await loading.present();
    
        var currentDate = Date.now();
        const file = ev.target.files[0];

        const filePath = `Images/${currentDate}`;
        const fileRef = this.storage.ref(filePath);
    
        const task = this.storage.upload(`Images/${currentDate}`, file);
        task.snapshotChanges()
          .pipe(finalize(async () => {
              this.panUrlSub = fileRef.getDownloadURL();
              this.panUrlSub.subscribe(async downloadURL => {
                if (downloadURL) {
                  this.showSuccesfulUploadAlertPan();
                  await loading.dismiss();
                  this.panUrl = downloadURL;
                }
                console.log(downloadURL);
              });
            
          })
          )
          .subscribe(url => {
            if (url) {
              console.log(url);
              // this.UrlOne = url;
            }
          });
      }

    async showSuccesfulUploadAlertAdhar() {
      const alert = await this.alertController.create({
        cssClass: 'basic-alert',
        header: 'Uploaded',
        subHeader: 'Image uploaded successfully',
        buttons: ['OK']
      });
  
      await alert.present();
    }

    async showSuccesfulUploadAlertPan() {
      const alert = await this.alertController.create({
        cssClass: 'basic-alert',
        header: 'Uploaded',
        subHeader: 'File uploaded successfully',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  
    base64ToImage(dataURI) {
      const fileDate = dataURI.split(',');
      // const mime = fileDate[0].match(/:(.*?);/)[1];
      const byteString = atob(fileDate[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      return blob;
    }
  

}
