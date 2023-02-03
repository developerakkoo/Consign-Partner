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
  agentForm: FormGroup;
  vehicleOwnerForm: FormGroup;
  companyForm: FormGroup;
  isVehicleForm: boolean = false;
  isAgentForm: boolean = false;
  isCompanyForm: boolean =false;
  user: Observable<any[]>;
  userCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth,
              private fb: FormBuilder, private data: DataService,
              private loadingController: LoadingController,
              private router: Router) {
                this.agentForm = this.fb.group({
                  name:[''],
                  email: [''],
                  password: [''],
                  address: [''],
                  mobile: [''],
                  alternatemobile: [''],
                  gst: [''],
                  origin:[''],
                  destination: new FormArray([]),
                  vehicleType: new FormArray([])

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

                this.companyForm = this.fb.group({
                  name:[''],
                  email: [''],
                  password: [''],
                  mobile: [''],
                  alternatemobile: [''],
                  gst: [''],
                  origin:[''],
                  destination: new FormArray([]),
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
      this.isAgentForm = false;
      this.userCollection = this.afs.collection(this.type, ref => ref.where('key', '==', this.userId));
    this.user = this.userCollection.valueChanges();
    this.user.subscribe((user: any) =>
    {
      console.log(user[0]);
      this.destinationArray = user[0]['destination'];
      this.vehicleOwnerForm.controls.destination.patchValue(['nashik', 'pune'])
            this.vehicleOwnerForm.controls.name.setValue(user[0]?.['name']);
      this.vehicleOwnerForm.controls.email.setValue(user[0]?.['email']);
      this.vehicleOwnerForm.controls.password.setValue(user[0]?.['password']);
      this.vehicleOwnerForm.controls.mobile.setValue(user[0]?.['mobile']);
      this.vehicleOwnerForm.controls.alternatemobile.setValue(user[0]?.['alternateMobile']);
      this.vehicleOwnerForm.controls.gst.setValue(user[0]?.['gst']);
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
    

    if(this.type == "Agent"){
      this.isVehicleForm = false;
      this.isCompanyForm = false;
      this.isAgentForm = true;
      this.userCollection = this.afs.collection('Agent', ref => ref.where('key', '==', this.userId));
    this.user = this.userCollection.valueChanges();
    this.user.subscribe((user: any) =>
    {
      console.log(user);
      this.destinationArray = user[0]['destination'];
            this.agentForm.controls.name.setValue(user[0]?.['name']);
      this.agentForm.controls.email.setValue(user[0]?.['email']);
      this.agentForm.controls.password.setValue(user[0]?.['password']);
      this.agentForm.controls.mobile.setValue(user[0]?.['mobile']);
      this.agentForm.controls.alternatemobile.setValue(user[0]?.['alternateMobile']);
      this.agentForm.controls.gst.setValue(user[0]?.['gst']);
      this.agentForm.controls.origin.setValue(user[0]?.['origin']);
      // this.vehicleOwnerForm.setValue(user[0]?.['destination'][0]['destination'])
      // this.vehicleOwnerForm.controls.vehicleType.setValue(user[0]?.['vehicleType'][0])
      let field;
      for (let index = 0; index < this.destinationArray.length; index++) {
        const element = this.destinationArray[index];
        console.log(element);

        field = this.fb.group(element);
        this.fieldsAgent.push(field);
      }

    }, (error) =>{
      console.log(error);
      
    })

 
    }
    

    if(this.type == "Company"){
      this.isVehicleForm = false;
      this.isCompanyForm = true;
      this.isAgentForm = false;
      this.userCollection = this.afs.collection('Company', ref => ref.where('key', '==', this.userId));
    this.user = this.userCollection.valueChanges();
    this.user.subscribe((user: any) =>
    {
      console.log(user);
      this.destinationArray = user[0]['destination'];
            this.companyForm.controls.name.setValue(user[0]?.['name']);
      this.companyForm.controls.email.setValue(user[0]?.['email']);
      this.companyForm.controls.password.setValue(user[0]?.['password']);
      this.companyForm.controls.mobile.setValue(user[0]?.['mobile']);
      this.companyForm.controls.alternatemobile.setValue(user[0]?.['alternateMobile']);
      this.companyForm.controls.gst.setValue(user[0]?.['gst']);
      this.companyForm.controls.origin.setValue(user[0]?.['origin']);
      // this.vehicleOwnerForm.setValue(user[0]?.['destination'][0]['destination'])
      // this.vehicleOwnerForm.controls.vehicleType.setValue(user[0]?.['vehicleType'][0])
      let field;
      for (let index = 0; index < this.destinationArray.length; index++) {
        const element = this.destinationArray[index];
        console.log(element);

        field = this.fb.group(element);
        this.fieldsCompany.push(field);
      }

    }, (error) =>{
      console.log(error);
      
    })

 
    }
    
    
    

  }


  get fieldsVehicle() {
    return this.vehicleOwnerForm.get("destination") as FormArray;
  }

  get fieldsAgent() {
    return this.agentForm.get("destination") as FormArray;
  }

  get fieldsCompany() {
    return this.companyForm.get("destination") as FormArray;
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


  addQuantityAgent() {
    const field = this.fb.group({
      destination: '',
    })
    this.fieldsAgent.push(field);
  }

  removeQuantityAgent(i: number, q) {
    console.log(q);
    
    this.fieldsAgent.removeAt(i);
  }

  addQuantityCompany() {
    const field = this.fb.group({
      destination: '',
    })
    this.fieldsCompany.push(field);
  }

  removeQuantityCompany(i: number) {
    this.fieldsCompany.removeAt(i);
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
     

  

  }

  async onSubmit(type){
    let loading = await this.loadingController.create({
      message: "Updating User..."
    })
    await loading.present();
   if(type === 'Company'){
    this.afs.doc(`${type}/${this.userId}`).update({
      name: this.companyForm.value.name,
mobile: this.companyForm.value.mobile,
alternatemobile: this.companyForm.value.alternatemobile,
gst: this.companyForm.value.gst,
origin: this.companyForm.value.origin,
destination: this.companyForm.value.destination
     }).then(async (user) =>{
      console.log(user);
      await loading.dismiss();
  
      
     }).catch(async (error) =>{
      console.log(error);
      await loading.dismiss();
      
     })
   }
   if(type === 'Agent'){
    this.afs.doc(`${type}/${this.userId}`).update({
      name: this.agentForm.value.name,
mobile: this.agentForm.value.mobile,
alternatemobile: this.agentForm.value.alternatemobile,
gst: this.agentForm.value.gst,
origin: this.agentForm.value.origin,
destination: this.agentForm.value.destination,
vehicleType: this.agentForm.value.vehicleType
     }).then(async (user) =>{
      console.log(user);
      await loading.dismiss();
  
      
     }).catch(async (error) =>{
      console.log(error);
      await loading.dismiss();
      
     })
   }
    
   if(type === 'VehicleOwner'){
    this.afs.doc(`${type}/${this.userId}`).update({
      name: this.vehicleOwnerForm.value.name,
      mobile: this.vehicleOwnerForm.value.mobile,
      alternatemobile: this.vehicleOwnerForm.value.alternatemobile,
      gst: this.vehicleOwnerForm.value.gst,
      origin: this.vehicleOwnerForm.value.origin,
      destination: this.vehicleOwnerForm.value.destination,
      vehicleType: this.vehicleOwnerForm.value.vehicleType
     }).then(async (user) =>{
      console.log(user);
      await loading.dismiss();
  
      
     }).catch(async (error) =>{
      console.log(error);
      await loading.dismiss();
      
     })
   }
  }

  openPasswordResetPage(){
    this.router.navigate(['profile','forgot-password'])

  }

}
