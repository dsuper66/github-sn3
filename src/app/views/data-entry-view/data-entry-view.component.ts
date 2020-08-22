import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';

//So that we can route here
// import { ActivatedRoute } from '@angular/router';

import { ShapeService } from '../shape.service';
import { ModelElementService } from '../../data-model/model-element.service';
import { Shape } from '../shape';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {

  constructor(
    private modelElementService: ModelElementService,
    private shapeService: ShapeService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getElementId();
  }

  myGroup: FormGroup;

  // myGroup = new FormGroup({
  //   firstName: new FormControl()
  // });

  propertiesFormArray = new FormArray([]);
  formTitles: string[] = [];


  propertyIds: string[];
  private selectedShape: Shape;
  private elementId = "none selected";


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
      console.log(">>> " + this.selectedShape.elementType);
      this.propertyIds = this.modelElementService.getPropertyIdsOfElementType(this.selectedShape.elementType);
      console.log(this.propertyIds)

      interface Dict {
        [key: string]: string;
      }
      let controlsConfig: Dict;

      var indexedArray: { [key: string]: any; } = {
        'conn1': ['none'],
        'conn2': ['none'],
        'resistance': ['none']
      }


      // indexedArray = {'conn1': ['none'],conn2':['none'],'resistance':['none']};
      // var controlsConfig: {
      //   [key: string]: any;}
      for (let propertyId of this.propertyIds) {
        this.formTitles.push(propertyId);


        this.propertiesFormArray.push(new FormControl(propertyId));
      }

      // console.log(">>>mm>>>" + indexedArray);
      //   this.myGroup = this.fb.group({
      //     'conn1': ['none'],
      //     'conn2':['none'],
      //     'resistance':['none'] });
      // }
      // this.myGroup = this.fb.group({
      //   indexedArray });
      // }


      // this.modelData.setValue(this.elementId);

    }
  }
}
