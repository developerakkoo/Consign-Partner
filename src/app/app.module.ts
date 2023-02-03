import { NgOtpInputModule } from 'ng-otp-input';
import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
const firebaseConfig = {
  apiKey: "AIzaSyB8jWxZPWeAFvV1HFMnYtM5ohdKYPsk15E",
  authDomain: "consign-612af.firebaseapp.com",
  databaseURL: "https://consign-612af-default-rtdb.firebaseio.com",
  projectId: "consign-612af",
  storageBucket: "consign-612af.appspot.com",
  messagingSenderId: "524688990077",
  appId: "1:524688990077:web:fa5d3d194dd1db196cb614",
  measurementId: "G-PHET99DV0G"
};
@NgModule({
  declarations: [AppComponent,],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpClientModule,
    GooglePlaceModule,
    NgOtpInputModule,
  AngularFireAuthModule, AngularFireDatabaseModule,AngularFireStorageModule,AngularFirestoreModule, IonicStorageModule.forRoot({name: 'agent'})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
