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

import { ModelElementDataService } from '../../data-model/model-element-data.service';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {
  idOfDataEntryObject: string;

  constructor(
    private modelElementService: ModelElementService,
    private modelElementDataService: ModelElementDataService,
    private router: Router,
    private route: ActivatedRoute
    // private shapeService: ShapeService) 
  ) {
    route.params.subscribe(params => { this.idOfDataEntryObject = params['id']; });
  }

  ngOnInit(): void {
    console.log("GOT ID ", this.idOfDataEntryObject);
    this.populateFormForElementId(this.idOfDataEntryObject);
  }

  // myGroup = new FormGroup({
  //   firstName: new FormControl()
  // });

  // propertiesFormArray = new FormArray([]);
  propertiesFormArray: FormControl[] = [];
  formTitles: string[] = [];
  formDefaults: string[] = [];
  formElementId: string[] = [];
  formPropertyId: string[] = [];

  //To get the data back from the data-entry form
  dataIds: string[] = [];
  // private selectedShape: Shape;
  // private elementId = "none selected";

  onSubmit(form: NgForm): void {
    //The form returns an object
    console.log('you submitted value:', form);

    //Extract the data from the object
    //Fields where no data has been entered are empty strings, so we don't update those
    if (this.dataIds) {
      // for (let propertyTypeId of this.dataIds.filter(id => Object(form)[id] != "")) {
      this.dataIds.forEach((propertyTypeId, index) => {
        const formValue = Object(form)[propertyTypeId];
        if (formValue && formValue != "") {


          let newValue = Object(form)[propertyTypeId];
          console.log(">>>value>>>" + propertyTypeId + ":" + newValue);

          this.modelElementDataService.setValueForElementProperty(this.idOfDataEntryObject, propertyTypeId, newValue);
        }
      })
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

  populateFormForElementId(elementId: string): void {
    //Get the element i.d. from the route
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // console.log(">>>Element ID:" + elementId 
    //   + " name:" + this.modelElementService.getElementName(elementId));
    // this.modelData.setValue(elementId);

    // this.selectedShape = this.shapeService.getSelectedShape();
    const selectedElement = this.modelElementDataService.getModelElementForId(elementId);
    if (selectedElement) {

      console.log(">>> " + selectedElement.elementTypeId);

      const parentProperties = this.modelElementDataService.getPropertyTypeIdsFor(selectedElement.elementTypeId);
      // this.dataIds = parentProperties;
      // console.log(this.dataIds)

      //Populate the property fields
      // .filter(property => property['visible'] === true 
      for (const parentPropertyId of parentProperties) {
        if (this.modelElementDataService.propertyIsVisible(parentPropertyId)) {

          //Data Id
          this.dataIds.push(parentPropertyId);
          //Title
          this.formTitles.push(parentPropertyId);
          //Default value
          const value = this.modelElementDataService.getValueForElementProperty(elementId, parentPropertyId);
          this.formDefaults.push(value);

          console.log(parentPropertyId + ": current value:" + value);

        }
        else {
          console.log(parentPropertyId + ": not visible")
        }
      }

      //Get child records
      const childElements = this.modelElementDataService.getChildIdsForElementId(elementId);
      for (const childElement of childElements) {
        // console.log("#####" + childElement.elementId);
        const childProperties = this.modelElementDataService.getPropertyTypeIdsFor(childElement.elementTypeId);
        // this.dataIds.push(childElement.elementTypeId);
        for (const childPropertyId of childProperties) {
          if (this.modelElementDataService.propertyIsVisible(childPropertyId)) {

            //Data Id
            this.dataIds.push(childPropertyId);
            //Title
            this.formTitles.push(childPropertyId + "[" + childElement.elementId + "]");
            //Default value
            const value = this.modelElementDataService.getValueForElementProperty(childElement.elementId, childPropertyId);
            this.formDefaults.push(value);

          }
          else {
            console.log(childPropertyId + ": not visible")
          }
        }
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
