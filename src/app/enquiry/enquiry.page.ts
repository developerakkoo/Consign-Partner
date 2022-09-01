import { DataService } from './../services/data.service';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
})
export class EnquiryPage implements OnInit {
  partnerId;
  partnerName;



  orderid;
  isAcceptedQuoteOrder = "false";

  OrderRef: AngularFirestoreDocument<any>;
  Order: Observable<any>;

  partnerRef: AngularFirestoreDocument<any>;
  partner: Observable<any>;

  images: any[] = [];
  date: string;
  time:string;

  isHelper: boolean;
  isPacking: boolean;
  sender:any;
  receiver:any;
  userid;

  quoteCollection: AngularFirestoreCollection<any>;

  quoteForm: FormGroup;
  constructor(private fb: FormBuilder,
              private router: Router,
              private loadingController: LoadingController,
              private afs: AngularFirestore,
              private data: DataService,
              private route: ActivatedRoute) {
               
                
    this.quoteForm = this.fb.group({
      vehicleNo: ['', [Validators.required]],
      driverMobile: ['', [Validators.required]],
      freightCharges: ['', [Validators.required]],
      advance:['', [Validators.required]],
      helper:['', [Validators.required]],
      packing: ['', [Validators.required]],
      waiting: ['', [Validators.required]],
      payment:['', [Validators.required]],
      cancel:['', [Validators.required]]
    })
   }

  async ngOnInit() {
    this.partnerId = await this.data.get('userid');
    this.orderid = this.route.snapshot.paramMap.get("orderId");
    this.isAcceptedQuoteOrder = this.route.snapshot.paramMap.get("value");
    console.log(`OrderId ${this.orderid}`);
    console.log(`APrtner Id ${this.partnerId}`);
    this.OrderRef  = this.afs.doc(`Orders/${this.orderid}`);
    this.quoteCollection = this.afs.collection('Quote');

    this.partnerRef = this.afs.doc(`VehicleOwner/${this.partnerId}`);
    this.partnerRef.valueChanges().subscribe((data) =>
    {
      console.log(data);
      this.partnerName = data['name'];
      
    })
   
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

  accept(){
    console.log("OrderAccepted");
    this.OrderRef.update({
      status: 'ongoing'
    }).then((success) =>{
      console.log(success);
      this.router.navigate(['approved', this.orderid]);
    }).catch((error) =>{
      console.log(error);
      
    })
    
  }

  reject(){
    console.log("Order Rejected");
    

  }

  async onSubmit(){
    let loading = await this.loadingController.create({
      message: "Submitting your quote..."
    })

    await loading.present();
    
    this.OrderRef.update({
      status: 'yellow',
      message: "Quote Submitted By Service Provider",
      helper: this.quoteForm.value.helper,
      package: this.quoteForm.value.packing,
      payment: this.quoteForm.value.payment,
      waiting: this.quoteForm.value.waiting,
      cancel: this.quoteForm.value.cancel,
      companyname: this.partnerName,
      vehNo:this.quoteForm.value.vehicleNo,
      DriverMobileNo: this.quoteForm.value.driverMobile,
      adv: this.quoteForm.value.advance,
      Freight: this.quoteForm.value.freightCharges


    }).then(async (order) =>{
      await loading.dismiss();
      this.router.navigate(['folder']);
    }).catch(async (error) =>{
      await loading.dismiss();

    })
  
    // this.router.navigate(['approved']);

  }

}
