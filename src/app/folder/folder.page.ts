import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public userid: string;

  isCompletedSegment: boolean = false;
  orders: Observable<any>;
  OrderCollection: AngularFirestoreCollection<any>;



  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastController: ToastController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private auth: AngularFireAuth,
              private afs: AngularFirestore,
              private data: DataService) { 
                this.OrderCollection = this.afs.collection<any>('Orders');
                this.orders = this.OrderCollection.valueChanges();
              }

   ngOnInit() {
  }

  segmentChanged(ev){
    if(ev.detail.value === "enq"){
      this.isCompletedSegment = false;
    }
    else if(ev.detail.value === "cenq"){
      this.isCompletedSegment = true;
    }

  }

  onOpenDetailPage(id){
    console.log(id);
    
    this.router.navigate(['enquiry', id]);
  }

}
