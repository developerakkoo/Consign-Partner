import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.page.html',
  styleUrls: ['./approved.page.scss'],
})
export class ApprovedPage implements OnInit {

  partnerId;
  partnerName;

  vehicleNo;
  driverNo;
  conNo;


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
    this.partnerId = await this.data.get('userid');
    this.orderid = this.route.snapshot.paramMap.get("orderid");
    this.isAcceptedQuoteOrder = this.route.snapshot.paramMap.get("value");
    console.log(`OrderId ${this.orderid}`);
    console.log(`APrtner Id ${this.partnerId}`);
    this.completedOrderRef = this.afs.collection(`completedOrder`);
    this.OrderRef = this.afs.doc(`Orders/${this.orderid}`);
    this.quoteCollection = this.afs.collection('Quote', ref => ref.where('orderId', '==', this.orderid));
    this.quoteCollection.valueChanges().subscribe((quote) =>{
      console.log("Quote for orderid");
      
      console.log(quote);
      this.quoteData = quote;
      
    })
    

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
        this.vehicleNo = order['vehicleNo'];
        this.driverNo = order['driverNo'];
        this.conNo = order['conNo'];
        await loading.dismiss();

      }, async (error) => {
        await loading.dismiss();
        console.log(error);

      })
  }

  approveDetails() {
    this.OrderRef.update({
      vehicleNo: this.vehicleNo,
      conNo: this.conNo,
      driverNo: this.driverNo
    }).then((success) => {

    }).catch((error) => {
      console.log(error);

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
          handler: () => {
           let obj = {
            ...this.quoteData[0],
            ...this.orderData
           }


           console.log(obj);
           
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
              message: "Fetching order Details..."
            })
        
            let obj = {
              ...this.quoteData[0],
              ...this.orderData,
              endTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
             console.log(obj);
             this.OrderRef.update({
             status: 'completed'
            }).then((success) => {
              let id = this.afs.createId();
              this.completedOrderRef.doc(id).set(obj).then(async(success) =>{
               await loading.dismiss();
                
               this.router.navigate(['biling', id]);
               }).catch(async(error) =>{
                 await loading.dismiss();
                 
              })
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
}
