import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Form, NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';

//So that we can route here
// import { ActivatedRoute } from '@angular/router';

import { ShapeService } from '../shape.service';
import { ModelElementService } from '../../data-model/model-element.service';
import { Shape } from '../shape';
import { isDefined } from '@angular/compiler/src/util';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {

  constructor(
    private modelElementService: ModelElementService,
    private shapeService: ShapeService) { }

  ngOnInit(): void {
    this.getElementId();
  }

  // myGroup = new FormGroup({
  //   firstName: new FormControl()
  // });

  // propertiesFormArray = new FormArray([]);
  propertiesFormArray: FormControl[] = [];
  formTitles: string[] = [];
  formDefaults: string[] = [];


  propertyTypeIds: string[];
  private selectedShape: Shape;
  private elementId = "none selected";

  onSubmit(form: NgForm): void {
    console.log('you submitted value:' , form);
    for (let propertyTypeId of this.propertyTypeIds.filter(
      id => Object(form)[id] != "")) {
        let newValue = Object(form)[propertyTypeId];
        console.log(">>>" + propertyTypeId + ":" + newValue);
      this.modelElementService.setValueForElementProperty(this.elementId,propertyTypeId,newValue);
    }
    // console.log('resistance:' , document.getElementById("resistance")[0].value)
    // console.log('resistance:' , form["resistance"]);
    // let items = form as {[property: string]: any};
    // for (let formItem of Object.values(form.controls) as {key:string,value:any}) {
    //   console.log("value:" + formItem.value)
    // form.forEach(element => {

    //   console.log(element)
    // }); 
      // for (const name in form.controls) {
      //     console.log ("ppp");
      // }
  }

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
      this.propertyTypeIds = this.modelElementService.getPropertyTypeIdsOfElementType(this.selectedShape.elementType);
      console.log(this.propertyTypeIds)

      // interface Dict {
      //   [key: string]: string;
      // }
      // let controlsConfig: Dict;

      // var indexedArray: { [key: string]: any; } = {
      //   'conn1': ['none'],
      //   'conn2': ['none'],
      //   'resistance': ['none']
      // }


      // indexedArray = {'conn1': ['none'],conn2':['none'],'resistance':['none']};
      // var controlsConfig: {
      //   [key: string]: any;}
      for (let propertyId of this.propertyTypeIds) {
        this.formTitles.push(propertyId);
        let currentValue = this.modelElementService.getValueForElementProperty(this.elementId,propertyId);
        this.formDefaults.push(currentValue);
        console.log("current value:" + currentValue);

        this.propertiesFormArray.push(new FormControl(currentValue));
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
