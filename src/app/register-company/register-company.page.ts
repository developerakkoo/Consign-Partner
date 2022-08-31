import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.page.html',
  styleUrls: ['./register-company.page.scss'],
})
export class RegisterCompanyPage implements OnInit {

  companyRegistrationForm: FormGroup;
  panUrl;
  panUrlSub;
  companyRef: AngularFirestoreCollection<any>;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private storage: AngularFireStorage) {

                this.companyRef = this.afs.collection('Company');

    this.companyRegistrationForm = this.fb.group({
      CompanyName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      origin: ['', [Validators.required]],
      destination: ['', Validators.required],
      mobile: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      name: ['', Validators.required],
      surname:['', Validators.required],
      flatNo: ['', [Validators.required]],
      apartmentAddress:['', [Validators.required, Validators.minLength(8)]],
      officeAddress:['',[Validators.required]],
      gst: ['', [Validators.required]]


    })
   }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  close(){
    this.modalController.dismiss();
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
      ...this.companyRegistrationForm.value,
     panUrl: this.panUrl
    }
    console.log(obj);

    let loading = await this.loadingController.create({
      message: "Registering user..."
    })
    await loading.present();
    this.auth.createUserWithEmailAndPassword(this.companyRegistrationForm.value.email, this.companyRegistrationForm.value.password)
    .then(async (user) =>{
      console.log(user.user.uid);
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
