import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
    userId:string;
    userForm: FormGroup;
    constructor(private afs: AngularFirestore, private auth: AngularFireAuth,
      private fb: FormBuilder, private data: DataService,
      private router: Router) {
        this.userForm = this.fb.group({
       
          email: ['']
  
        })
       }
  
  
    ngOnInit() {
    }
  
    onSubmit(){
      this.auth.sendPasswordResetEmail(this.userForm.value.email).then((success) =>{
        console.log(success);
        this.router.navigate(['/']);
        
      }).catch((error) =>{
        console.log(error);
        alert(error);
        
      })
    }
}
