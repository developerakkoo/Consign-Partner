import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-vehicleowner',
  templateUrl: './register-vehicleowner.page.html',
  styleUrls: ['./register-vehicleowner.page.scss'],
})
export class RegisterVehicleownerPage implements OnInit {

  vehicleRegistrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.vehicleRegistrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      origin: ['', [Validators.required]],
      destination: ['', Validators.required],
      mobile: ['', [Validators.required]],
      alternateMobile: ['', [Validators.required]],
      name: ['', Validators.required],
      surname:['', Validators.required],
      flatNo: ['', [Validators.required]],
      apartmentAddress:['', [Validators.required, Validators.minLength(8)]],
      officeAddress:['',[Validators.required]]


    })
   }

  ngOnInit() {
  }




  onSubmit(){
    console.log(this.vehicleRegistrationForm.value);
    
  }

}
