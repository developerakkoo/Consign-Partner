import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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
  segmentName: string = 'live';

  orders: Observable<any>;
  OrderCollection: AngularFirestoreCollection<any>;

  pendingOrders: Observable<any>;
  pendingOrderCollection: AngularFirestoreCollection<any>;




  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastController: ToastController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private auth: AngularFireAuth,
              private afs: AngularFirestore,
              private data: DataService) { 
                this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==','live'));
                this.orders = this.OrderCollection.valueChanges(['added']);
                this.OrderCollection.valueChanges(['added']).subscribe((data) =>{
                this.sound.play();

                })
              }

   async ngOnInit() {
    this.partnerId = await this.data.get('userid');
    this.pendingOrderCollection = this.afs.collection<any>('AcceptedQuote', ref => ref.where('partnerId', '==', this.partnerId));
    this.pendingOrders = this.pendingOrderCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }

  segmentChanged(ev){
    if(ev.detail.value === "enq"){
      this.isCompletedSegment = false;
      this.segmentName = 'live';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==','live'));
                this.orders = this.OrderCollection.valueChanges();
      
    }
    else if(ev.detail.value === "cenq"){
      this.isCompletedSegment = true;
      this.segmentName = 'pending';
      this.OrderCollection = this.afs.collection<any>('Orders', ref => ref.where('status', '==','pending'));
                this.orders = this.OrderCollection.valueChanges();

    }

  }

  onOpenDetailPage(id, value){
    console.log(id);
    
    this.router.navigate(['enquiry', id, value]);
  }

}
