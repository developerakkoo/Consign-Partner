import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-agent',
  templateUrl: './register-agent.page.html',
  styleUrls: ['./register-agent.page.scss'],
})
export class RegisterAgentPage implements OnInit {
  agentRegistrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.agentRegistrationForm = this.fb.group({
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
    this.router.navigate(['folder']);
  }

}
