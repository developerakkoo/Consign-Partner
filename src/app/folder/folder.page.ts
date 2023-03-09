import { TaxinvoicePage } from './../taxinvoice/taxinvoice.page';
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
      src: ['assets/notify.mp3'],
      html5: true
    });
    sound2 = new Howl({
      src: ['assets/note1.wav'],
      html5: true
    });
    sound3 = new Howl({
      src: ['assets/note2.wav'],
      html5: true
    });

    sound4 = new Howl({
      src: ['assets/note3.wav'],
      html5: true
    });
    sound5 = new Howl({
      src: ['assets/note4.wav'],
      html5: true
    });

  isCompletedSegment: boolean = false;
  isEnquiriesSegment: boolean = true;
  isSubmittedSegment: boolean = false;
  isApprovedSegment: boolean =false;


  segmentName: string = 'blue';

  orders: Observable<any>;
  ordersPlay: Observable<any>;
  OrderCollection: AngularFirestoreCollection<any>;
  OrderPlayCollection: AngularFirestoreCollection<any>;
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
        
    this.OrderPlayCollection =this.afs.collection('Orders');
    this.ordersPlay = this.OrderPlayCollection.valueChanges(['modified']);
    this.OrderCollection = this.afs.collection('Orders', ref => ref.where('status', '==', this.segmentName).orderBy("createdAt", "desc"));
     
               this.orders =  this.OrderCollection.snapshotChanges(['added','modified']).pipe(
   
                  map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    
                    
                    return { id, ...data };
                  }))
                );

               this.ordersPlay.subscribe((data) =>{
                console.log(data);
                
                data.forEach(element => {
                  if(element['status'] == "blue"){
                    console.log("blue");
                    this.sound.play();
                  }
                  if(element['status'] == "yellow"){
                    console.log("yellow");
                    this.sound2.play();

                    
                  }
                  if(element['status'] == "green"){
                    console.log("green");
                    this.sound3.play();

                    
                  }
                  if(element['status'] == "red"){
                    console.log("red");
                    this.sound4.play();

                    
                  }
                  if(element['status'] == "aqua"){
                    console.log("aqua");
                    this.sound5.play();

                    
                  }
                });
                
               })
                

  }

  segmentChanged(ev){
    if(ev.detail.value === "enq"){
      this.isCompletedSegment = false;
      this.isEnquiriesSegment = true;
      this.isSubmittedSegment =false;
      this.isApprovedSegment = false;
      this.segmentName = 'sptopartner';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName).orderBy("createdAt", "desc"));
                this.orders = this.OrderCollection.valueChanges();
                this.orders.subscribe((data) =>{
                  console.log(data);
                  
                  data.forEach(element => {
                    if(element['status'] == "sptopartner"){
                      console.log("blue");
                      this.sound.play();
                    }
                    if(element['status'] == "yellow"){
                      console.log("yellow");
                      
                    }
                    if(element['status'] == "green"){
                      console.log("green");
                      
                    }
                    if(element['status'] == "red"){
                      console.log("red");
                      
                    }
                    if(element['status'] == "aqua"){
                      console.log("aqua");
                      
                    }
                  });
                  
                 })
      
    }
    else if(ev.detail.value === "senq"){
      this.isCompletedSegment = false;
      this.isEnquiriesSegment = false;
      this.isSubmittedSegment =true;
      this.isApprovedSegment = false;
      this.segmentName = 'yellow';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName).orderBy("createdAt", "desc"));
                this.orders = this.OrderCollection.valueChanges();
                this.orders.subscribe((data) =>{
                  console.log(data);
                  
                  data.forEach(element => {
                    if(element['status'] == "blue"){
                      console.log("blue");
                      this.sound.play();
                    }
                    if(element['status'] == "yellow"){
                      console.log("yellow");
                      
                    }
                    if(element['status'] == "green"){
                      console.log("green");
                      
                    }
                    if(element['status'] == "red"){
                      console.log("red");
                      
                    }
                    if(element['status'] == "aqua"){
                      console.log("aqua");
                      
                    }
                  });
                  
                 })

    }
    else if(ev.detail.value === "cenq"){
      this.isCompletedSegment = false;
      this.isEnquiriesSegment = false;
      this.isSubmittedSegment =false;
      this.isApprovedSegment = true;
      this.segmentName = 'assigned';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName).orderBy("createdAt", "desc"));
                this.orders = this.OrderCollection.valueChanges();
                this.orders.subscribe((data) =>{
                  console.log(data);
                  
                  data.forEach(element => {
                    if(element['status'] == "blue"){
                      console.log("blue");
                      this.sound.play();
                    }
                    if(element['status'] == "yellow"){
                      console.log("yellow");
                      
                    }
                    if(element['status'] == "green"){
                      console.log("green");
                      
                    }
                    if(element['status'] == "red"){
                      console.log("red");
                      
                    }
                    if(element['status'] == "aqua"){
                      console.log("aqua");
                      
                    }
                  });
                  
                 })

    }
    else if(ev.detail.value === "completed"){
      this.isCompletedSegment = true;
      this.isEnquiriesSegment = false;
      this.isSubmittedSegment =false;
      this.isApprovedSegment = false;
      this.segmentName = 'red';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==',this.segmentName).orderBy("createdAt", "desc"));
                this.orders = this.OrderCollection.valueChanges();
                this.orders.subscribe((data) =>{
                  console.log(data);
                  
                  data.forEach(element => {
                    if(element['status'] == "blue"){
                      console.log("blue");
                      this.sound.play();
                    }
                    if(element['status'] == "yellow"){
                      console.log("yellow");
                      
                    }
                    if(element['status'] == "green"){
                      console.log("green");
                      
                    }
                    if(element['status'] == "red"){
                      console.log("red");
                      
                    }
                    if(element['status'] == "aqua"){
                      console.log("aqua");
                      
                    }
                  });
                  
                 })

    }

  }
  onOpenBillingPage(order){
    console.log(order);
    
    this.router.navigate(['biling', order.orderId])
  }

  openProfilePage(){
    this.router.navigate(['profile']);
  }
  async onOpenDetailPage(order){
    const modal = await this.modalController.create({
      component: TaxinvoicePage,
      componentProps: { quote: order }
      });
    
      await modal.present();
    
  }

}
