import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import jspdf from 'jspdf';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-taxinvoice',
  templateUrl: './taxinvoice.page.html',
  styleUrls: ['./taxinvoice.page.scss'],
})
export class TaxinvoicePage implements OnInit {
  invoicestartvalue;
  @Input() quote: any;
  @ViewChild('invoice', {read: ElementRef}) invoice: ElementRef;

  FreightCharges;
  advanceCharges;
  cancelCharges;
  helperCharges;
  waitingCharges;
  packagingCharges;
  totalCharges;
  grandTotalCharges;
  paymentCharges;
  gstCharges;

  cgst;
  sgst;

  ugst;
  igst;

  isHelper;
  isPacking;

  senderObj;
  receiverObj;

  gstType;
  gstPercent;

  companyName = "FRUGAL INNOVATIONS PVT LTD";

  gst = "27AACCF5797L1ZY";
  companyAddress = "VASUDHA STASHA, WARJE PUNE 411021 MAHARASHTRA.";

  todaysDate= "";
  invoiceNumber;
  currentYear;
  futureYear;

  private orderCollection: AngularFirestoreCollection<any>;
  orders: Observable<any[]>;

  createOrderSub: Subscription;

  isGst:boolean = false;
  isCgstSgst: boolean = false;
  isIgstUIgst: boolean = false;

  constructor(private modalController: ModalController,
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
              private http: HttpClient) { 
                this.db.object('key').valueChanges().subscribe((val) =>{
                  console.log(val);
                  this.invoicestartvalue =val;
                  this.generateInvoiceNumber(val);
                  
                })
              }

  ngOnInit() {
    console.log(this.quote);

    this.currentYear = moment().format("YY");
    this.futureYear = moment().add(1, "year").format("YY");
    console.log("Current Year:- "+ this.currentYear);
    console.log("Future Year:- "+ this.futureYear);
    
    this.todaysDate = moment().format("DD/MM/YYYY");

    this.advanceCharges = this.quote['adv'];
    this.cancelCharges = this.quote['cancel'];
    this.helperCharges = this.quote['helper'];
    this.waitingCharges = this.quote['waiting'];
    this.packagingCharges = this.quote['package'];
    this.paymentCharges = this.quote['payment'];
    this.gstPercent = this.quote['gstPercent'];
    this.gstType = this.quote['gstType'];
    this.isHelper = this.quote['ishelper'];
    this.isPacking = this.quote['ispacking'];
    this.FreightCharges = this.quote['Freight'] + this.advanceCharges + this.helperCharges + this.cancelCharges + this.packagingCharges + this.waitingCharges + this.paymentCharges;

    this.senderObj = this.quote['sender'];
    this.receiverObj = this.quote['receiver'];
    this.invoiceNumber = this.generateInvoiceNumber(this.invoicestartvalue);
    console.log(this.invoiceNumber);
    if(this.gstType == "IGST"){
      this.isGst = true;
      this.isCgstSgst = false;
      this.isIgstUIgst = false;
    }

    else if(this.gstType == "CGSTSGST"){
      this.isGst = false;
      this.isCgstSgst = true;
      this.isIgstUIgst = false; 
    }
    else if(this.gstType == "IGSTUGST"){
      this.isGst = false;
      this.isCgstSgst = false;
      this.isIgstUIgst = true; 
    }
    

    console.log(`gstType:- ${this.gstType} and Percent is:- ${this.gstPercent}`);
    this.calculateTotalAndGST(this.helperCharges, this.packagingCharges, this.cancelCharges, this.FreightCharges, 0,this.waitingCharges);
    
  }

  close(){
    this.modalController.dismiss();
  }

  ionViewDidEnter(){
    console.log(this.quote);

    this.currentYear = moment().format("YY");
    this.futureYear = moment().add(1, "year").format("YY");
    console.log("Current Year:- "+ this.currentYear);
    console.log("Future Year:- "+ this.futureYear);
    
    this.todaysDate = moment().format("DD/MM/YYYY");

    this.advanceCharges = this.quote['adv'];
    this.cancelCharges = this.quote['cancel'];
    this.helperCharges = this.quote['helper'];
    this.waitingCharges = this.quote['waiting'];
    this.packagingCharges = this.quote['package'];
    
    this.isHelper = this.quote['ishelper'];
    this.isPacking = this.quote['ispacking'];
    
    this.FreightCharges = this.quote['Freight'];
    this.senderObj = this.quote['sender'];
    this.receiverObj = this.quote['receiver'];
    this.invoiceNumber = this.generateInvoiceNumber(this.invoicestartvalue);
    console.log(this.invoiceNumber);
    this.calculateTotalAndGST(this.helperCharges, this.packagingCharges, this.cancelCharges, this.FreightCharges, 0,this.waitingCharges);
  }

  ionViewDidLeave(){
    this.createOrderSub.unsubscribe();
  }

  generateInvoiceNumber(value){
    let incValue = parseInt(value);
    let plusOneValue = incValue + 1;
    console.log("incValue:- "+ incValue);
    
    console.log(this.currentYear+ this.futureYear+"/"+ plusOneValue);
    this.invoiceNumber = this.currentYear+ this.futureYear+"/"+ plusOneValue;

    


  }

  calculateTotalAndGST(helper, packing, cancel, freight, insurance,waiting){
    let h = parseInt(helper);
    let p = parseInt(packing);
    let c = parseInt(cancel);
    let f = parseInt(freight);
    let i = parseInt(insurance);
    let w = parseInt(waiting);
    let total = f ;
    console.log(`helper ${h}`);
    console.log(`packing ${p}`);
    console.log(`cancel ${c}`);
    console.log(`frieght ${f}`);
    console.log(`insurance ${i}`);
    console.log(`waititng ${w}`);
    
    console.log(`Total is ${total}`);
    this.totalCharges = total;

    if(this.isCgstSgst){
      let gst = (f * this.gstPercent) / 100;
      this.gstCharges = gst;
  
      let cgst = (f * this.gstPercent) / 100;
      let sgst = (f * this.gstPercent) / 100;
  
      this.cgst = cgst;
      this.sgst = sgst;
  
      this.grandTotalCharges = total + cgst + sgst;
      console.log(`Grand total is:- ${this.grandTotalCharges}`);
    }

    if(this.isGst){
      let gst = (f * this.gstPercent) / 100;
      this.gstCharges = gst;
  
   
  
      this.grandTotalCharges = total + gst;
      console.log(`Grand total is:- ${this.grandTotalCharges}`);
    }

    if(this.isIgstUIgst){
     
  
      let igst = (f * this.gstPercent) / 100;
      let ugst = (f * this.gstPercent) / 100;
  
      this.igst = igst;
      this.ugst = ugst;
  
      this.grandTotalCharges = total + igst + ugst;
      console.log(`Grand total is:- ${this.grandTotalCharges}`);
    }
    
    
  }

  downloadInvoice(){
    let data = document.getElementById("invoice");  
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
      pdf.save(`${this.invoiceNumber}.pdf`);   
    }); 
    // const doc = new jsPDF();
   
    // const pdfTable = this.invoice.nativeElement;
   
    // var html = htmlToPdfmake(pdfTable.innerHTML);
     
    // const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).open(); 
  }
  goToPaymentModal(){
    console.log(this.grandTotalCharges);
  }

  acceptQuote() {
    console.log(this.quote);
      this.afs.doc(`Orders/${this.quote.id}`)
      .update({
        status: 'green',
        isAccepted: true,
        message:"Quote Accepted By User."
      }).then((success) =>{
       this.close();

      }).catch((error) =>{
      console.log(error);
      
    })
    
  }



 

}
