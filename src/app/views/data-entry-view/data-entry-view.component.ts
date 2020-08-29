import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Form, NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';

//So that we can extract the i.d.
import { ActivatedRoute } from '@angular/router';

import { ShapeService } from '../shape.service';
import { ModelElementService } from '../../data-model/model-element.service';
import { Shape } from '../shape';
import { isDefined } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {
  id: string;

  constructor(
    private modelElementService: ModelElementService,
    private router: Router,
    private route: ActivatedRoute,
    private shapeService: ShapeService) {
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit(): void {
    console.log("GOT ID ", this.id);
    this.getDataForElementId(this.id);
  }

  // myGroup = new FormGroup({
  //   firstName: new FormControl()
  // });

  // propertiesFormArray = new FormArray([]);
  propertiesFormArray: FormControl[] = [];
  formTitles: string[] = [];
  formDefaults: string[] = [];

  //To get the data back from the form
  propertyTypeIds: string[];
  // private selectedShape: Shape;
  // private elementId = "none selected";

  onSubmit(form: NgForm): void {
    //The form returns an object
    console.log('you submitted value:', form);

    //Extract the data from the object
    //Fields where no data has been entered are empty strings, so we don't update those
    if (this.propertyTypeIds) {
      for (let propertyTypeId of this.propertyTypeIds.filter(
        id => Object(form)[id] != "")) {

        let newValue = Object(form)[propertyTypeId];
        console.log(">>>" + propertyTypeId + ":" + newValue);

        this.modelElementService.setValueForElementProperty(this.id, propertyTypeId, newValue);
      }
    }
    //Submit also navigates back
    this.router.navigate(['/network-builder-component']);

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

  getDataForElementId(elementId: string): void {
    //Get the element i.d. from the route
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // console.log(">>>Element ID:" + elementId 
    //   + " name:" + this.modelElementService.getElementName(elementId));
    // this.modelData.setValue(elementId);

    // this.selectedShape = this.shapeService.getSelectedShape();
    const selectedElement = this.modelElementService.getModelElementForId(elementId);
    if (selectedElement) {
      // this.elementId = this.selectedShape.elementId;
      console.log(">>> " + selectedElement.elementTypeId);
      this.propertyTypeIds =
        this.modelElementService.getPropertyTypeIdsOfElementType(selectedElement.elementTypeId);
      console.log(this.propertyTypeIds)

      // interface Dict {
      //   [key: string]: string;
      // }
      // let controlsConfig: Dict;

      // var indexedArray: { [key: string]: any; } = {
      //   'connId1': ['none'],
      //   'connId2': ['none'],
      //   'resistance': ['none']
      // }


      // indexedArray = {'connId1': ['none'],connId2':['none'],'resistance':['none']};
      // var controlsConfig: {
      //   [key: string]: any;}

      //Populate the property fields
      for (let propertyId of this.propertyTypeIds) {
        this.formTitles.push(propertyId);
        let value = this.modelElementService.getValueForElementProperty(elementId, propertyId);
        this.formDefaults.push(value);
        console.log("current value:" + value);

        this.propertiesFormArray.push(new FormControl(value));
      }

      // console.log(">>>mm>>>" + indexedArray);
      //   this.myGroup = this.fb.group({
      //     'connId1': ['none'],
      //     'connId2':['none'],
      //     'resistance':['none'] });
      // }
      // this.myGroup = this.fb.group({
      //   indexedArray });
      // }


      // this.modelData.setValue(this.elementId);

    }
  }
}
