import { DataService } from './../services/data.service';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
})
export class EnquiryPage implements OnInit {
  partnerId;
  partnerName;
  partnerType;



  orderid;
  isAcceptedQuoteOrder = "false";

  OrderRef: AngularFirestoreDocument<any>;
  Order: Observable<any>;

  partnerRef: AngularFirestoreDocument<any>;
  partner: Observable<any>;
  vehicleImageUrl;

  isVehicleAuto;
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
      // vehicleNo: ['', [Validators.required]],
      // driverMobile: ['', [Validators.required]],
      freightCharges: [0, [Validators.required]],
      advance:[0, [Validators.required]],
      helper:[0],
      packing: [0],
      waiting: [0, [Validators.required]],
      payment:[0, [Validators.required]],
      cancel:[0, [Validators.required]]
    })
   }

  async ngOnInit() {
    this.partnerType = await this.data.get("usertype");
    this.partnerId = await this.data.get('userid');
    this.orderid = this.route.snapshot.paramMap.get("orderId");
    this.isAcceptedQuoteOrder = this.route.snapshot.paramMap.get("value");
    console.log(`OrderId ${this.orderid}`);
    console.log(`APrtner Id ${this.partnerId}`);
    this.OrderRef  = this.afs.doc(`Orders/${this.orderid}`);
    this.quoteCollection = this.afs.collection('Quote');

    console.log(`PArtner type is ${this.partnerType}`);
    
    if(this.partnerType == "agent"){
      this.partnerRef = this.afs.doc(`Agent/${this.partnerId}`);
    this.partnerRef.valueChanges().subscribe((data) =>
    {
      console.log(data);
      this.partnerName = data['name'];
      
    })
    }
    if(this.partnerType == "vehicle"){
      this.partnerRef = this.afs.doc(`VehicleOwner/${this.partnerId}`);
    this.partnerRef.valueChanges().subscribe((data) =>
    {
      console.log(data);
      this.partnerName = data['name'];
      
    })
    }

    if(this.partnerType == "company"){
      this.partnerRef = this.afs.doc(`Company/${this.partnerId}`);
    this.partnerRef.valueChanges().subscribe((data) =>
    {
      console.log(data);
      this.partnerName = data['name'];
      
    })
    }
   
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
      this.isHelper = order['ishelper'];
      this.isPacking = order['ispacking'];
      this.userid = order['userId'];
      this.isVehicleAuto = order['isVehicleAuto'];
      this.vehicleImageUrl = order['vehicleImageUrl'];

      await loading.dismiss();
      
    }, async(error) =>{
      await loading.dismiss();
      console.log(error);
      
    })
  }

 

  async onSubmit(){
    let loading = await this.loadingController.create({
      message: "Submitting your quote..."
    })

    await loading.present();
    
    this.OrderRef.update({
      status: 'yellow',
      message: "Order submitted by service provider",
      helper: this.quoteForm.value.helper || 0,
      package: this.quoteForm.value.packing || 0,
      payment: this.quoteForm.value.payment || 0,
      waiting: this.quoteForm.value.waiting || 0,
      cancel: this.quoteForm.value.cancel || 0,
      companyname: this.partnerName,
     
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
