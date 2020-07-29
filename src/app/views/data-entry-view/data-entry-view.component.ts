import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

//So that we can extract the i.d. from the route
import { ActivatedRoute } from '@angular/router';

import {ModelElementService} from '../../data-model/model-element.service';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {

  constructor(
    private modelElementService: ModelElementService,
    private route: ActivatedRoute)
    { }

  ngOnInit(): void {
    this.getElementId();
  }

  modelData = new FormControl('');


  getElementId(): void {
    //Get the element i.d. from the route
    const elementId = this.route.snapshot.paramMap.get('elementId');
    console.log(">>>Element ID:" + elementId 
      + " name:" + this.modelElementService.getElementName(elementId));
    this.modelData.setValue(elementId);
  }

}

// export class FavoriteColorComponent {
//   favoriteColorControl = new FormControl('');

// }
