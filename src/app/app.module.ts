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
const firebaseConfig = {
  apiKey: "AIzaSyDQ0ZCA4N9SqgS2su0awaZbmcox8tWbY58",
  authDomain: "test-75cf9.firebaseapp.com",
  projectId: "test-75cf9",
  storageBucket: "test-75cf9.appspot.com",
  messagingSenderId: "71939903995",
  appId: "1:71939903995:web:42ffbcb63f22573f093b5e",
  measurementId: "G-LT1P926Y55"
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpClientModule,
  AngularFireAuthModule, AngularFireDatabaseModule,AngularFireStorageModule,AngularFirestoreModule, IonicStorageModule.forRoot({name: 'agent'})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
