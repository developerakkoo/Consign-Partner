import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register-vehicleowner',
  templateUrl: './register-vehicleowner.page.html',
  styleUrls: ['./register-vehicleowner.page.scss'],
})
export class RegisterVehicleownerPage implements OnInit {

  vehicleRegistrationForm: FormGroup;
  vehicleRef: AngularFirestoreCollection<any>;


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
      officeAddress:['',[Validators.required]],
      

    })
   }

  ngOnInit() {
    this.getGstDataFromApi();
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

  async getGstDataFromApi(){
    let headers = new HttpHeaders();
    headers.append("client_id", "GSP4ea49af0-17d3-4df7-8aed-c620e4806b9c");
    headers.append("client_secret", "GSP286e85df-4313-43dd-9b54-fc79b81f5ffb");

    this.http.get(`https://api.mastergst.com/public/search?email=mvk20@rediffmail.com&gstin=27AACCF5797L1ZY`,{
      headers: headers
    }).subscribe((value) => {
      console.log(value);
      
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

    
  }
  onChange(event: any) {
    console.log(event.target.value);
    switch (event.target.value) {
      case "100":
        this.vehicleType = "100"
        break;
      case "500":
        this.vehicleType = "500"
        break;
      case "600":
        this.vehicleType = "600"
        break;
      case "750":
        this.vehicleType = "750"
        break;

      case "1000":
        this.vehicleType = "1000"
        break;

      case "1208":
        this.vehicleType = "1208"
        break;

      case "1250":
        this.vehicleType = "1250"
        break;

      case "1300":
        this.vehicleType = "1300"
        break;

      case "1500":
        this.vehicleType = "1500"
        break;

      case "1700":
        this.vehicleType = "1700"
        break;
      default:
        this.vehicleType = "100 KG"
        break;
    }
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
