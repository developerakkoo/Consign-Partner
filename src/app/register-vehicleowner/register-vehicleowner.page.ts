import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const gst = "27AACCF5797L1ZY";
@Component({
  selector: 'app-register-vehicleowner',
  templateUrl: './register-vehicleowner.page.html',
  styleUrls: ['./register-vehicleowner.page.scss'],
})
export class RegisterVehicleownerPage implements OnInit {

  vehicleRegistrationForm: FormGroup;
  vehicleRef: AngularFirestoreCollection<any>;
  vehicleDataRef: AngularFirestoreCollection<any>;
  vehicleData: Observable<any>;


  isGstAvailable: boolean = false;
  drivingLicenseUrl;
  drivingLicenseUrlSub;
  rcUrl;
  gstNumber;
  rcUrlSub;

  vehicleType = "100";

  insuaranceUrl;
  insuaranceUrlSub;
  driverPhotoUrl;
  driverPhotoUrlSub;
  vehicleUrl;
  vehicleUrlSub;
  

  constructor(private formBuilder: FormBuilder,
              private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private modalController: ModalController,
              private storage: AngularFireStorage,
              private http: HttpClient
              ) 
              {
                this.vehicleRef = this.afs.collection('VehicleOwner');
                this.vehicleDataRef = this.afs.collection('vehicle-files');
                this.vehicleData = this.vehicleDataRef.valueChanges();

    this.vehicleRegistrationForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', Validators.required],
      mobile: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      name: ['', Validators.required],
      surname:['', Validators.required],
      apartmentAddress:['', [Validators.required, Validators.minLength(8)]],
      officeAddress:['',[Validators.required]],
      gstNo: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      

    })
   }

  ngOnInit() {
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

  gstSelectEvent(ev){
    console.log(ev.detail.value);
    let value = ev.detail.value;
    if(value == "yesgst"){
      this.isGstAvailable = true;
    }
    if(value == "nogst"){
      this.isGstAvailable = false;
    }
    
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

      console.log(addr.length);
      console.log(pradr);

      if(Object.getOwnPropertyNames(pradr).length !== 0){
        console.log(`PRADR is empty`);
        let add = pradr['bnm'] + " "+  pradr['bno'] + " " + pradr['loc'] + " " + pradr['st'] + " "+ pradr['pncd'] + " " + pradr['stcd'] + " " + pradr['dst'];
        this.vehicleRegistrationForm.get("apartmentAddress").setValue(add)
        
      }

      if(addr.length !== 0){
        console.log(`addr is empty`);
        let add = addr['bnm']+ " "+ addr['bno'] + " " + addr['loc'] + " " +addr['st'] + " "+ addr['stcd'] +" " +addr['dst'] +" " +addr['pncd'];
        this.vehicleRegistrationForm.get("officeAddress").setValue(add);
      }
      
      
    })

    
  }

  async onSubmit(){
    
    
    let loading = await this.loadingController.create({
      message: "Registering user..."
    })
    await loading.present();
    this.auth.createUserWithEmailAndPassword(this.vehicleRegistrationForm.value.email, this.vehicleRegistrationForm.value.password)
    .then(async (user) =>{
      let obj = {
        key: user.user.uid,
        ...this.vehicleRegistrationForm.value,
        vehicleType: this.vehicleType,
        // DL: this.drivingLicenseUrl,
        // RC: this.rcUrl,
        // InsuaranceUrl: this.insuaranceUrl,
        // DriverPhoto: this.driverPhotoUrl,
        // VehiclePhoto: this.vehicleUrl
      }
      console.log(obj);
      console.log(user.user.uid);
      this.vehicleRef.doc(user.user.uid).set(obj).then(async (data) =>{
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
    console.log(this.vehicleType);
    

    
  }
  onChange(event: any) {
    console.log(event.target.value);
    this.vehicleType = event.detail.value;
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
  async uploadDrivingLicense(ev){
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
            this.drivingLicenseUrlSub = fileRef.getDownloadURL();
            this.drivingLicenseUrlSub.subscribe(async downloadURL => {
              if (downloadURL) {
                this.showSuccesfulUploadAlertPan();
                await loading.dismiss();
                this.drivingLicenseUrl = downloadURL;
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

    async uploadRc(ev){
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
              this.rcUrlSub = fileRef.getDownloadURL();
              this.rcUrlSub.subscribe(async downloadURL => {
                if (downloadURL) {
                  this.showSuccesfulUploadAlertPan();
                  await loading.dismiss();
                  this.rcUrl = downloadURL;
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

      async uploadInsuarance(ev){
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
                this.insuaranceUrlSub = fileRef.getDownloadURL();
                this.insuaranceUrlSub.subscribe(async downloadURL => {
                  if (downloadURL) {
                    this.showSuccesfulUploadAlertPan();
                    await loading.dismiss();
                    this.insuaranceUrl = downloadURL;
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

        async uploadDriverImage(ev){
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
                  this.driverPhotoUrlSub = fileRef.getDownloadURL();
                  this.driverPhotoUrlSub.subscribe(async downloadURL => {
                    if (downloadURL) {
                      this.showSuccesfulUploadAlertPan();
                      await loading.dismiss();
                      this.driverPhotoUrl = downloadURL;
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

          async uploadVehicleImage(ev){
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
                    this.vehicleUrlSub = fileRef.getDownloadURL();
                    this.vehicleUrlSub.subscribe(async downloadURL => {
                      if (downloadURL) {
                        this.showSuccesfulUploadAlertPan();
                        await loading.dismiss();
                        this.vehicleUrl = downloadURL;
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
