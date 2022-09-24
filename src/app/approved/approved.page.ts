import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import {Howl, Howler} from 'howler';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.page.html',
  styleUrls: ['./approved.page.scss'],
})
export class ApprovedPage implements OnInit {

  partnerId;
  partnerName;
  partnerType;


  vehicleNo;
  driverNo;
  conNo;
  sound = new Howl({
    src: ['assets/ordersuccess1.wav','assets/startOTPsound.mp3']
  });


  orderSuccessSound = this.sound.play();
  startOtpSound = this.sound.play();

  quoteData;
  orderData;


  orderid;
  isAcceptedQuoteOrder = "false";

  OrderRef: AngularFirestoreDocument<any>;
  completedOrderRef: AngularFirestoreCollection<any>;
  Order: Observable<any>;

  quoteRef: AngularFirestoreDocument<any>;
  quote: Observable<any>;

  images: any[] = [];
  date: string;
  time: string;

  isHelper: boolean;
  isPacking: boolean;
  sender: any;
  receiver: any;
  userid;

  startOtp;
  stopOtp;

  startOTPInput;
  stopOTPInput;

  isVehicleAuto;
  vehicleImageUrl;

  Endtime;


  quoteCollection: AngularFirestoreCollection<any>;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private afs: AngularFirestore,
    private data: DataService,
    private alertController: AlertController,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.partnerType = await this.data.get("type");
    this.partnerId = await this.data.get('userid');
    this.orderid = this.route.snapshot.paramMap.get("orderid");
    this.isAcceptedQuoteOrder = this.route.snapshot.paramMap.get("value");
    console.log(`OrderId ${this.orderid}`);
    console.log(`APrtner Id ${this.partnerId}`);
    this.OrderRef = this.afs.doc(`Orders/${this.orderid}`);
    
    

    let loading = await this.loadingController.create({
      message: "Fetching order Details..."
    })

    await loading.present();
    this.OrderRef.valueChanges()
      .subscribe(async (order) => {
        console.log(order);
        this.orderData = order;
        this.images = order['images'];
        this.date = order['date'];
        this.time = order['time'];
        this.sender = order['sender'];
        this.receiver = order['receiver'];
        this.isHelper = order['helper'];
        this.isPacking = order['packing'];
        this.userid = order['userId'];
        this.startOtp = order['startOTP'];
        this.stopOtp = order['stopOTP'];
        this.vehicleNo = order['vehNo'];
        this.driverNo = order['DriverMobileNo'];
        this.conNo = order['conNo'];
        this.isVehicleAuto = order['isVehicleAuto'];
        this.vehicleImageUrl = order['vehicleImageUrl'];
        // this.startOTPInput = order['startOTP'];
        // this.stopOTPInput = order['stopOTP'];
        await loading.dismiss();

      }, async (error) => {
        await loading.dismiss();
        console.log(error);

      })
  }

  async approveDetails() {
    let loading = await this.loadingController.create({
      message: "Submitting order Details..."
    })

    await loading.present();
    this.OrderRef.update({
      VehNo: this.vehicleNo,
      conNo: this.conNo,
      DriverMobileNo: this.driverNo,
      message: "Note Vehicle number and driver details.",
      serviceProviderId: this.partnerId,
      status: "green"
    }).then(async (success) => {
      await loading.dismiss();

    }).catch(async (error) => {
      console.log(error);
      await loading.dismiss();

    })

  }

  startOrder() {
    console.log(this.startOtp);
    if (this.startOtp == this.startOTPInput) {
      this.presentAlertConfirmStart("Confirm to start the order?")
    }
    else {
      this.presentAlert('Start OTP does not match.');

    }
  }

  stopOrder() {
    console.log(this.stopOtp);
    if (this.stopOtp == this.stopOTPInput) {
      this.presentAlertConfirmStop("Confirm to stop the order?");

    } else {
      this.presentAlert('Stop OTP does not match.');

    }

  }


  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Contact the person for correct details.',
      message: `${msg}.`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirmStart(msg) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `<strong>${msg}</strong>!!!`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler:async () => {
            let loading = await this.loadingController.create({
              message: "Starting your Order..."
            })
            this.sound.play(this.startOtpSound);

        
           
             await loading.present();
           this.OrderRef.update({
            message: "Start OTP Entered By SP Success.",
            
           }).then(async (success) => {
             
            await loading.dismiss();
            this.presentAlertStarted("Order Successfully started.")
             
            // this.router.navigate(['biling', this.orderid]);
            
         }).catch(async(error) => {
           console.log(error);
           await loading.dismiss();

     
         })
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirmStop(msg) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `<strong>${msg}</strong>!!!`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: async () => {
            let loading = await this.loadingController.create({
              message: "Generating Order Bill Details..."
            })
        
           
             await loading.present();
             this.OrderRef.update({
             status: 'red',
             isCompleted: true,
             endTime: "",
             message: "Stop Otp entered by SP Success."
            }).then(async (success) => {
             
               await loading.dismiss();
                this.sound.play();
               this.router.navigate(['biling', this.orderid]);
               
            }).catch(async(error) => {
              console.log(error);
              await loading.dismiss();

        
            })
             
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertStarted(msg) {
    const alert = await this.alertController.create({
      header: 'Order Started',
      message: msg,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
