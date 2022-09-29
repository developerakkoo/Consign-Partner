import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  userId:string;
  userForm: FormGroup;
  user: Observable<any[]>;
  userCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth,
              private fb: FormBuilder, private data: DataService,
              private loadingController: LoadingController,
              private router: Router) {
                this.userForm = this.fb.group({
                  name:[''],
                  email: [''],
                  password: [''],
                  address: [''],
                  mobile: [''],

                })
               }

  async ngOnInit() {
    
    this.userId = await this.data.get("userid");
    console.log(this.userId);
    this.userCollection = this.afs.collection(`VehicleOwner`, ref => ref.where('key', '==', this.userId));
    this.user = this.userCollection.valueChanges();
    this.user.subscribe((user: any) =>
    {
      console.log(user);
      this.userForm.controls.name.setValue(user[0]['name']);
      this.userForm.controls.email.setValue(user[0]['email']);
      this.userForm.controls.password.setValue(user[0]['password']);
      this.userForm.controls.mobile.setValue(user[0]['mobile']);
      this.userForm.controls.address.setValue(user[0]['address']);
    }, (error) =>{
      console.log(error);
      
    })
    
    
    

  }

  async onSubmit(){
    let loading = await this.loadingController.create({
      message: "Updating User..."
    })
    await loading.present();
   this.afs.doc(`VehicleOwner/${this.userId}`).update({
    address: this.userForm.value.address,
    mobile: this.userForm.value.mobile,
    name: this.userForm.value.name,
   }).then(async (user) =>{
    console.log(user);
    await loading.dismiss();

    
   }).catch(async (error) =>{
    console.log(error);
    await loading.dismiss();
    
   })
    
  }

  openPasswordResetPage(){
    this.router.navigate(['profile','forgot-password'])

  }

}
