import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.page.html',
  styleUrls: ['./register-company.page.scss'],
})
export class RegisterCompanyPage implements OnInit {

  companyRegistrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.companyRegistrationForm = this.fb.group({
      CompanyName: ['', [Validators.required]],
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
      officeAddress:['',[Validators.required]],
      gst: ['', [Validators.required]]


    })
   }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(){

  }

}
