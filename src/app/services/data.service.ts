import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) {
    this.init();
   }

   init(){
    this.storage.create();
   }

   get(key){
    return this.storage.get(key);
   }

   set(key, value){
    return this.storage.set(key, value);
   }

   remove(key){
    return this.storage.remove(key);
   }
}
