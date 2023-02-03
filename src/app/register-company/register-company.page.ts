import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.page.html',
  styleUrls: ['./register-company.page.scss'],
})
export class RegisterCompanyPage implements OnInit {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options: Options;
  companyRegistrationForm: FormGroup;
  destinationForm: FormGroup;
  panUrl;
  panUrlSub;
  companyRef: AngularFirestoreCollection<any>;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private http: HttpClient,
              private storage: AngularFireStorage) {

                this.companyRef = this.afs.collection('Company');

    this.companyRegistrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(5)]],
      origin: ['', [Validators.required]],
      destination: this.fb.array([]),
      mobile: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      name: ['', Validators.required],
      surname:['', Validators.required],
      gst: ['', [Validators.required]]


    })

    this.destinationForm = this.fb.group({
      destinations: this.fb.array([])
    });
   }


  ngOnInit() {
  }

  get fields() {
    return this.companyRegistrationForm.get("destination") as FormArray;
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
  close(){
    this.modalController.dismiss();
  }

  public handleAddressChangeDestination(address: Address, i) {
    // Do some stuff
    console.log(address['formatted_address']);
    let add = address['address_components'];
    
  
    let formArr = <FormArray>this.companyRegistrationForm.get("destination");
  
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
    
  
    this.companyRegistrationForm.get("origin").patchValue(address?.formatted_address)
    // this.agentRegistrationForm.patchValue({
    //   destination: address?.formatted_address
    // })
      
  
  
  
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

  onOtpChangeA(ev){
    console.log(ev);
    this.companyRegistrationForm.patchValue({adhar:ev});
    
  }

  onOtpChangeP(ev){
    console.log(ev);
    this.companyRegistrationForm.patchValue({pan:ev});
    
  }


  

  gstHandleEvent(ev) {
    let value = ev.detail.value;
    console.log(value);
    console.log(value.length);
    if (value.length == 15) {
      console.log("Send Gst Api request");
      this.getGstDataFromApi(value);
    }

  }
  async getGstDataFromApi(gst){


    this.http.get(`https://api.consign.co.in/getgst/${gst}`)
    .subscribe((value) => {
      console.log(value);
      let addr = value['data']['data']['adadr'][0];
      let pradr = value['data']['data']['pradr']['addr'];
      let companyname = value['data']['data']['lgnm'];
      console.log(addr.length);
      console.log(pradr);

      this.companyRegistrationForm.get("name").setValue(companyname);
      if(Object.getOwnPropertyNames(pradr).length !== 0){
        console.log(`PRADR is empty`);
        let add = pradr['bnm'] + " "+  pradr['bno'] + " " + pradr['loc'] + " " + pradr['st'] + " "+ pradr['pncd'] + " " + pradr['stcd'] + " " + pradr['dst'];
        this.companyRegistrationForm.get("surname").setValue(add)
        
      }

      if(addr.length !== 0){
        console.log(`addr is empty`);
        let add = addr['bnm']+ " "+ addr['bno'] + " " + addr['loc'] + " " +addr['st'] + " "+ addr['stcd'] +" " +addr['dst'] +" " +addr['pncd'];
        this.companyRegistrationForm.get("surname").setValue(add);
      }
      
      
    })

    
  }
  async onSubmit(){
let obj = {
  ...this.companyRegistrationForm.value
}
   
console.log(obj);


    let loading = await this.loadingController.create({
      message: "Registering user..."
    })
    await loading.present();
    this.auth.createUserWithEmailAndPassword(this.companyRegistrationForm.value.email, this.companyRegistrationForm.value.password)
    .then(async (user) =>{
      console.log(user.user.uid);
      let obj = {
        key: user.user.uid,
        ...this.companyRegistrationForm.value,
       panUrl: this.panUrl
      }
      this.companyRef.doc(user.user.uid).set(obj).then(async (data) =>
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

}
