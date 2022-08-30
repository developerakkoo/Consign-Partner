import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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





  orderid;
  isAcceptedQuoteOrder = "false";

  OrderRef: AngularFirestoreDocument<any>;
  Order: Observable<any>;

  quoteRef: AngularFirestoreDocument<any>;
  quote: Observable<any>;

  images: any[] = [];
  date: string;
  time:string;

  isHelper: boolean;
  isPacking: boolean;
  sender:any;
  receiver:any;
  userid;

  quoteCollection: AngularFirestoreCollection<any>;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private afs: AngularFirestore,
    private data: DataService,
    private route: ActivatedRoute) { }

    async ngOnInit() {
      this.partnerId = await this.data.get('userid');
      this.orderid = this.route.snapshot.paramMap.get("orderid");
      this.isAcceptedQuoteOrder = this.route.snapshot.paramMap.get("value");
      console.log(`OrderId ${this.orderid}`);
      console.log(`APrtner Id ${this.partnerId}`);
      this.OrderRef  = this.afs.doc(`Orders/${this.orderid}`);
      // this.quoteCollection = this.afs.collection('Quote');
  
      // this.partnerRef = this.afs.doc(`VehicleOwner/${this.partnerId}`);
      // this.partnerRef.valueChanges().subscribe((data) =>
      // {
      //   console.log(data);
      //   this.partnerName = data['name'];
        
      // })
     
      let loading = await this.loadingController.create({
        message: "Fetching order Details..."
      })
  
      await loading.present();
      this.OrderRef.valueChanges()
      .subscribe(async (order) =>
      {
        console.log(order);
        this.images = order['images'];
        this.date = order['date'];
        this.time = order['time'];
        this.sender = order['sender'];
        this.receiver = order['receiver'];
        this.isHelper = order['helper'];
        this.isPacking = order['packing'];
        this.userid = order['userId'];
        await loading.dismiss();
        
      }, async(error) =>{
        await loading.dismiss();
        console.log(error);
        
      })
    }
  
    approveDetails(){
      this.OrderRef.update({
        vehicleNo: this.vehicleNo,
        conNo: this.conNo,
        driverNo: this.driverNo
      }).then((success) =>{

      }).catch((error) =>{
        console.log(error);
        
      })

    }
}
