import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

//So that we can route here
// import { ActivatedRoute } from '@angular/router';

import { ShapeService } from '../shape.service';
import {ModelElementService} from '../../data-model/model-element.service';
import { Shape } from '../shape';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {

  constructor(
    private modelElementService: ModelElementService,
    private shapeService: ShapeService)
    // private route: ActivatedRoute)
    { }

  ngOnInit(): void {
    this.getElementId();
  }

  modelData = new FormControl('');
  selectedShape:Shape;
  elementId = "none selected";


  getElementId(): void {
    //Get the element i.d. from the route
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // console.log(">>>Element ID:" + elementId 
    //   + " name:" + this.modelElementService.getElementName(elementId));
    // this.modelData.setValue(elementId);

    this.selectedShape = this.shapeService.getSelectedShape();
    if (this.selectedShape) {
      this.elementId = this.selectedShape.elementId;
    }
    this.modelData.setValue(this.elementId);

  }
}
