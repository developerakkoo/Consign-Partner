import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register-agent',
  templateUrl: './register-agent.page.html',
  styleUrls: ['./register-agent.page.scss'],
})
export class RegisterAgentPage implements OnInit {
  agentRegistrationForm: FormGroup;
  destinationForm: FormGroup;

  agentRef: AngularFirestoreCollection<any>;

  adharUrl;
  adharUrlSub;
  panUrl;
  panUrlSub;
  base64Image;


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
      destinations: this.fb.array([])


    })

    this.destinationForm = this.fb.group({
      destinations: this.fb.array([])
    });
   }

  ngOnInit() {

  }
  close(){
    this.modalController.dismiss();
  }

  get fields() {
    return this.agentRegistrationForm.get("destinations") as FormArray;
  }

  newField(): FormGroup {
    return this.fb.group({
      destinations: '',
    })
  }

  addQuantity() {
    const field = this.fb.group({
      destinations: '',
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
      panUrl: this.panUrl
    }
    console.log(obj);

    let loading = await this.loadingController.create({
      message: "Registering user..."
    })
    await loading.present();
    this.auth.createUserWithEmailAndPassword(this.agentRegistrationForm.value.email, this.agentRegistrationForm.value.password)
    .then(async (user) =>{
      console.log(user.user.uid);
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
