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

  orderid;

  OrderRef: AngularFirestoreDocument<any>;
  Order: Observable<any>;

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
              private route: ActivatedRoute) {
               
                
    this.quoteForm = this.fb.group({
      vehicleNo: ['', [Validators.required]],
      driverMobile: ['', [Validators.required]],
      freightCharges: ['', [Validators.required]],
      advance:['', [Validators.required]],
      helper:['', [Validators.required]],
      packing: ['', [Validators.required]],
      waiting: ['', [Validators.required]],
      payment:['', [Validators.required]]
    })
   }

  async ngOnInit() {
    this.orderid = this.route.snapshot.paramMap.get("orderId");
    console.log(`OrderId ${this.orderid}`);
    this.OrderRef  = this.afs.doc(`Orders/${this.orderid}`);
    this.quoteCollection = this.afs.collection('Quote');
   
    let loading = await this.loadingController.create({
      message: "Fetching order Details..."
    })

    await loading.present();
    this.OrderRef.valueChanges().subscribe(async (order) =>{
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

  async onSubmit(){
    let loading = await this.loadingController.create({
      message: "Fetching order Details..."
    })

    await loading.present();
    let obj = {
      orderId : this.orderid,
      userId: this.userid,
      partnerId: "",
      vehicleNo:this.quoteForm.value.vehicleNo,
      driverMobile: this.quoteForm.value.driverMobile,
      advance: this.quoteForm.value.advance,
      helper: this.quoteForm.value.helper,
      packing: this.quoteForm.value.packing,
      paymentMode: this.quoteForm.value.payment,
      waiting: this.quoteForm.value.waiting,
      freightCharges: this.quoteForm.value.freightCharges
    }
    console.log(obj);
    let id = this.afs.createId();
    this.quoteCollection.doc(id).set(obj).then(async (data) =>{
      await loading.dismiss();
    }).catch(async(error) =>{
      console.log(error);
      await loading.dismiss();

      
    })
    // this.router.navigate(['approved']);

  }

}
