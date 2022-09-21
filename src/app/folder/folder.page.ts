import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Howl, Howler} from 'howler';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public userid: string;
  partnerId;
   sound = new Howl({
      src: ['assets/notify.mp3']
    });

  isCompletedSegment: boolean = false;
  isEnquiriesSegment: boolean = true;
  isSubmittedSegment: boolean = false;
  isApprovedSegment: boolean =false;


  segmentName: string = 'blue';

  orders: Observable<any>;
  OrderCollection: AngularFirestoreCollection<any>;
  partnerCollection: AngularFirestoreDocument<any>;

  pendingOrders: Observable<any>;
  pendingOrderCollection: AngularFirestoreCollection<any>;

    vehicleType;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastController: ToastController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private auth: AngularFireAuth,
              private afs: AngularFirestore,
              private data: DataService) { 
                
              }

   async ngOnInit() {
    this.partnerId = await this.data.get('userid');
    this.partnerCollection = this.afs.doc<any>(`VehicleOwner/${this.partnerId}`);
    // this.partnerCollection.valueChanges().subscribe((partner) =>{
    //   this.vehicleType = partner['vehicleType'];
    //   console.log(this.vehicleType);
    //   // .where('vehicleType', '==', this.vehicleType)
  

      
    // })
        
    
    this.OrderCollection = this.afs.collection('Orders', ref => ref.where('status', '==', this.segmentName).orderBy("createdAt", "desc"));
     
               this.orders =  this.OrderCollection.snapshotChanges(['added','modified']).pipe(
   
                  map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    this.sound.play();
                    console.log("Playsound!");
                    
                    return { id, ...data };
                  }))
                );

  }

  segmentChanged(ev){
    if(ev.detail.value === "enq"){
      this.isCompletedSegment = false;
      this.isEnquiriesSegment = true;
      this.isSubmittedSegment =false;
      this.isApprovedSegment = false;
      this.segmentName = 'blue';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName));
                this.orders = this.OrderCollection.valueChanges();
      
    }
    else if(ev.detail.value === "senq"){
      this.isCompletedSegment = false;
      this.isEnquiriesSegment = false;
      this.isSubmittedSegment =true;
      this.isApprovedSegment = false;
      this.segmentName = 'yellow';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName));
                this.orders = this.OrderCollection.valueChanges();

    }
    else if(ev.detail.value === "cenq"){
      this.isCompletedSegment = false;
      this.isEnquiriesSegment = false;
      this.isSubmittedSegment =false;
      this.isApprovedSegment = true;
      this.segmentName = 'green';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName));
                this.orders = this.OrderCollection.valueChanges();

    }
    else if(ev.detail.value === "completed"){
      this.isCompletedSegment = true;
      this.isEnquiriesSegment = false;
      this.isSubmittedSegment =false;
      this.isApprovedSegment = false;
      this.segmentName = 'red';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName));
                this.orders = this.OrderCollection.valueChanges();

    }

  }
  onOpenBillingPage(order){
    console.log(order);
    
    this.router.navigate(['biling', order.orderId])
  }

  onOpenDetailPage(id, value){
    console.log(id);
    if(value == true){
      this.router.navigate(['approved', id]);

    }
    else if(value == false){

      this.router.navigate(['enquiry', id, value]);
    }
    
  }

}
