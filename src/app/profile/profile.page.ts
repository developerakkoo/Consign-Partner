import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import { getAuth } from "firebase/auth";
import { type } from 'os';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  options: Options;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  destinationArray:any[];
  userId:string;
  type;
  userForm: FormGroup;
  vehicleOwnerForm: FormGroup;
  companyForm: FormGroup;
  isVehicleForm: boolean = false;
  isCustomerForm: boolean = false;
  isCompanyForm: boolean =false;
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

                });

                this.vehicleOwnerForm = this.fb.group({
                  name:[''],
                  email: [''],
                  password: [''],
                  mobile: [''],
                  alternatemobile: [''],
                  gst: [''],
                  origin:[''],
                  destination: new FormArray([]),
                  vehicleType: new FormArray([])
                })
               }

  async ngOnInit() {
    
    this.userId = await this.data.get("userid");
    this.type = await this.data.get("usertype");
    console.log(this.userId);
    console.log(this.type);
    
    if(this.type == "VehicleOwner"){
      this.isVehicleForm = true;
      this.isCompanyForm = false;
      this.isCustomerForm = false;
      this.userCollection = this.afs.collection(this.type, ref => ref.where('key', '==', this.userId));
    this.user = this.userCollection.valueChanges();
    this.user.subscribe((user: any) =>
    {
      console.log(user[0]['destination']);
      this.destinationArray = user[0]['destination'];
      this.vehicleOwnerForm.controls.destination.patchValue(['nashik', 'pune'])
            this.vehicleOwnerForm.controls.name.setValue(user[0]?.['name']);
      this.vehicleOwnerForm.controls.email.setValue(user[0]?.['email']);
      this.vehicleOwnerForm.controls.password.setValue(user[0]?.['password']);
      this.vehicleOwnerForm.controls.mobile.setValue(user[0]?.['mobile']);
      this.vehicleOwnerForm.controls.alternatemobile.setValue(user[0]?.['alternateMobile']);
      this.vehicleOwnerForm.controls.gst.setValue(user[0]?.['gstNo']);
      this.vehicleOwnerForm.controls.origin.setValue(user[0]?.['origin']);
      // this.vehicleOwnerForm.setValue(user[0]?.['destination'][0]['destination'])
      // this.vehicleOwnerForm.controls.vehicleType.setValue(user[0]?.['vehicleType'][0])
      let field;
      for (let index = 0; index < this.destinationArray.length; index++) {
        const element = this.destinationArray[index];
        console.log(element);

        field = this.fb.group(element);
        this.fieldsVehicle.push(field);
      }

    }, (error) =>{
      console.log(error);
      
    })

 
    }
    
    
    

  }


  get fieldsVehicle() {
    return this.vehicleOwnerForm.get("destination") as FormArray;
  }

  newField(): FormGroup {
    return this.fb.group({
      destination: '',
    })
  }

  addQuantity() {
    const field = this.fb.group({
      destination: '',
    })
    this.fieldsVehicle.push(field);
  }

  removeQuantity(i: number) {
    this.fieldsVehicle.removeAt(i);
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    console.log(address);
    let add = address['address_components'];
    console.log(add[add.length - 1 ]['long_name']);
    console.log(add[add.length - 3 ]['long_name']);
    console.log(add[add.length - 4 ]['long_name']);

    this.vehicleOwnerForm.setValue({
      destination: address['formatted_address']
    })
      // this.ionicForm.setValue({
      //   name: this.ionicForm.value.name, 
      //   mobile: this.ionicForm.value.mobile,
      //   mobileOtp: this.ionicForm.value.mobileOtp,
      //   password: this.ionicForm.value.password,
      //   confirmpassword: this.ionicForm.value.confirmpassword,
      //   email: this.ionicForm.value.email,
      //   emailOtp: this.ionicForm.value.emailOtp,
      //   gstNo: this.ionicForm.value.gstNo,
      //   adress: address['formatted_address'],
      // });

  

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
