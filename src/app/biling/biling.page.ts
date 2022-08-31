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

  km;
  startTime;
  endTime;
  waitingTime;
  
  private completedOrderRef: AngularFirestoreDocument<any>;
  completedOrders: Observable<any[]>;


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private afs: AngularFirestore,
    private loadingController: LoadingController,
    private alertController: AlertController) {
    
     }

    async ngOnInit() {
      let loading =await this.loadingController.create({
        message: 'Fetching Billing Summary...'
      })
      await loading.present()
    this.oderid = this.activatedRoute.snapshot.paramMap.get("id");
      this.userid = await this.data.get("userid");
                this.completedOrderRef = this.afs.doc(`completedOrder/${this.oderid}`);
                this.completedOrderRef.valueChanges().subscribe(async(data) => {
                  console.log(data);
                  this.total = data['freightCharges'];
                  this.startTime = data['time'];
                  this.helper = data['advance'];
                  this.packing = data['cancel'];
                  await loading.dismiss();
                },async(error) =>{
                  await loading.dismiss();
                })

    }

    goHome(){
      this.router.navigate(['folder']);
    }

}
