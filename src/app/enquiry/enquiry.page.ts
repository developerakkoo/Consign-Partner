import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
})
export class EnquiryPage implements OnInit {

  quoteForm: FormGroup;
  constructor(private fb: FormBuilder,
              private router: Router) {
    this.quoteForm = this.fb.group({
      vehicleNo: ['', [Validators.required]],
      driverMobile: ['', [Validators.required]],
      freightCharges: ['', [Validators.required]],
      advance:['', [Validators.required]],
      helper:['', [Validators.required]],
      packing: ['', [Validators.required]],
      waiting: ['', [Validators.required]],
      payment:['', [Validators.required]]
    })
   }

  ngOnInit() {
  }

  onSubmit(){
    this.router.navigate(['approved']);

  }

}
