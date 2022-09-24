import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-biling',
  templateUrl: './biling.page.html',
  styleUrls: ['./biling.page.scss'],
})
export class BilingPage implements OnInit {

  userid;
  oderid;

  total;
  helper;
  packing;
  fare;
  sender;
  receiver;
  km;
  startTime;
  endTime;
  waitingTime;
  
  ishelper;
  ispacking;
  billamount;
  private completedOrderRef: AngularFirestoreDocument<any>;
  completedOrders: Observable<any[]>;


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private afs: AngularFirestore,
    private loadingController: LoadingController,
    private alertController: AlertController) {
    this.oderid = this.activatedRoute.snapshot.paramMap.get("id");

    
     }

    async ngOnInit() {
      let loading =await this.loadingController.create({
        message: 'Fetching Billing Summary...'
      })
      await loading.present()
      this.userid = await this.data.get("userid");
                this.completedOrderRef = this.afs.doc(`Orders/${this.oderid}`);
                this.completedOrderRef.valueChanges().subscribe(async(data) => {
                  console.log(data);
                  this.total = data['Freight'];
                  this.startTime = data['time'];
                  this.helper = data['helper'];
                  this.packing = data['cancel'];
                  this.sender = data['sender'];
                  this.receiver = data['receiver'];
                  this.ishelper = data['ishelper'];
                  this.ispacking = data['ispacking'];
                  await loading.dismiss();
                  if(this.ishelper == true && this.ispacking == true){
                    console.log("Both packingand helper");
                    this.billamount = parseInt(this.total) + parseInt(this.helper) + parseInt(this.packing);
                  }
                  else if(this.ishelper == true){
                    console.log("Only helper");
                    this.billamount = parseInt(this.total) + parseInt(this.helper);
                  }
                  else if(this.packing == true){
                    console.log("Only packing");
                    this.billamount = parseInt(this.total) + parseInt(this.packing);
                  }
                  else{
                    this.billamount = this.total;
                  }
                },async(error) =>{
                  await loading.dismiss();
                })

    }

    goHome(){
      this.router.navigate(['folder']);
    }

}
