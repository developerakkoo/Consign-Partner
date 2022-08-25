import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  isCompletedSegment: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  segmentChanged(ev){
    if(ev.detail.value === "enq"){
      this.isCompletedSegment = false;
    }
    else if(ev.detail.value === "cenq"){
      this.isCompletedSegment = true;
    }

  }

  onOpenDetailPage(){
    this.router.navigate(['enquiry']);
  }

}
