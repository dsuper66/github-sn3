import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Form, NgModel } from '@angular/forms';


//So that we can extract the i.d.
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

import { ModelElementDataService } from '../../data-model/model-element-data.service';
import { ModelElementDefService } from '../../data-model/model-element-def.service';
import { MathModelDefService } from '../../data-model/math-model-def.service';
import { SettingsService } from '../../data-model/settings.service';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {
  idOfDataEntryObject: string;

  constructor(
    private modelElementDataService: ModelElementDataService,
    private modelElementDefService: ModelElementDefService,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private mathModelDefService: MathModelDefService
  ) {
    route.params.subscribe(params => { this.idOfDataEntryObject = params['id']; });
  }

  ngOnInit(): void {
    const id = this.idOfDataEntryObject;
    console.log("GOT ID ", id); //this.idOfDataEntryObject);
    if (id === "model-def") {
      this.doConstraintDefs = true;
      this.populateFromConstraintDefs();
    }
    else if (id.includes("constraintComp")) {
      this.doConstraintComps = true;
      const startPos = id.indexOf("?") + 1;
      this.populateFromConstraintComps(id.substr(startPos));
    }   
    else {
      this.doDataEntry = true;
      this.populateFormFromElementId(id);
    }
    
  }

  doConstraintDefs = false;
  doConstraintComps = false;
  doDataEntry = false;

  formNames: string[] = [];
  formDefaults: string[] = [];
  formElementIds: string[] = [];
  formPropertyIds: string[] = [];


  //Call this component from itself to display something different
  //https://stackoverflow.com/questions/52389376/angular-6-how-to-reload-current-page/52492081
  reload(target: string) {
    console.log("##" + target);
    // this.populateFromConstraintComps(target);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['../' + target], { relativeTo: this.route });
    this.router.navigate(['../constraintComp?' + target], { relativeTo: this.route });
  }
  reloadMain() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['../' + target], { relativeTo: this.route });
    this.router.navigate(['../model-def'], { relativeTo: this.route });
  }  

  //Constraint Defintions
  setIncludeStatus(constraintName: string, status: boolean){
    console.log(">>>" + constraintName + " >>>" + status);
  }
  getIncludeStatus(constraintName: string) {
    return true;
  }
  //Constraint Components
  getFactorStatus(factorId: string): boolean {
    return this.mathModelDefService.factorIsEnabled(factorId);
  }
  setFactorStatus(factorId: string, isEnabled: boolean) {
    return this.mathModelDefService.setFactorStatus(factorId, isEnabled);
  }

  //===SUBMIT===
  onSubmit(form: NgForm): void {
    //The form returns an object
    console.log('you submitted value:', form);

    //Extract the data from the object
    //Fields where no data has been entered are empty strings, so we don't update those
    if (this.formNames) {
      this.formNames.forEach((formName, index) => {

        const formValue = Object(form)[formName];

        if (formValue && formValue != "") {

          // let newValue = Object(form)[propertyType];
          console.log(">>>value>>>" + formName + ":" + formValue);
          const propertyId = this.formPropertyIds[index];
          const elementId = this.formElementIds[index];

          this.modelElementDataService.setPropertyForElement(elementId, propertyId, formValue);
        }
      })
    }
    //Submit also navigates back
    this.router.navigate(['/network-builder-component']);

  }

  pageTitle = "";
  ccArray: [string[]] = [[]];
  cdArray:string[] = [];

  populateFromConstraintDefs(){
    console.log("populateFromConstraintDefs");
    const constraintDefs = this.mathModelDefService.getConstraintDefsAll();
    for (const constraintDef of constraintDefs) {
      console.log(">>>" + constraintDef.constraintType);
      this.formNames.push(constraintDef.constraintType);
    }
  }

  populateFromConstraintComps(constraintType: string){
    console.log("populateFromConstraintComps");
    this.pageTitle = "Constraint: " + constraintType;
    const constraintDef = this.mathModelDefService.getConstraintDef(constraintType);
    const constraintComps = this.mathModelDefService.getConstraintComps(constraintType);

    var a:string[] = [];    
    this.cdArray.push("parent elementType: " + constraintDef.elementType)
    this.cdArray.push("inequality: " + constraintDef.inEquality)
    if (constraintDef.rhsProperty != "") {
      this.cdArray.push("rhsProperty: " + constraintDef.rhsProperty)
    }
    else {
      this.cdArray.push("rhsValue: " + constraintDef.rhsValue)
    }
    
    //If the parent has a var in the equation
    if (constraintDef.varType != "") {
      // this.cdArray.push(constraintDef.elementType + "." + constraintDef.varType)
      // const mult = constraintDef.factorValue.toString() + " x ";
      // if (constraintDef.factorProperty != "") {a.push(mult + constraintDef.factorProperty)};

      
      this.formNames.push(constraintDef.elementType + "." + constraintDef.varType);
      var a:string[] = [];
      a.push("[parent var]")
      var factors = constraintDef.factorValue.toString() + " x ";
      if (constraintDef.factorProperty != "") {factors += constraintDef.factorProperty};
      a.push(factors)
      this.ccArray.push(a);
    }

    //The child vars in the equation
    for (const constraintComp of constraintComps) {
      this.formNames.push(constraintComp.elementType + "." + constraintComp.varType);
      console.log(">>>" + constraintComp.varType);
      var a:string[] = [];
      a.push("[" + constraintComp.propertyMap + "]");
      var factors = constraintComp.factorValue.toString() + " x ";
      if (constraintComp.factorProperty != "") {factors += constraintComp.factorProperty};
      if (constraintComp.factorParentProperty != "") {factors += constraintComp.factorParentProperty};
      a.push(factors);

      this.ccArray.push(a);
      
      // this.formNames.push("=========");
    }
  }  

  constraintString: string = "";
  
  populateFormFromElementId(elementId: string): void {
   
    const selectedElement = this.modelElementDataService.getModelElementForId(elementId);
    if (selectedElement) {      
      //Properties
      const parentProperties = this.modelElementDefService.getPropertyTypesFor(selectedElement.elementType);
      this.populateFormFieldsFromProperties(parentProperties,selectedElement.elementId);

      //Get child records
      const childElements = this.modelElementDataService.getChildElements(elementId);
      for (const childElement of childElements) {
        const childProperties = this.modelElementDefService.getPropertyTypesFor(childElement.elementType);
        this.populateFormFieldsFromProperties(childProperties,childElement.elementId);
      }

      //Constraint components
      if (selectedElement.constraintString) {
        this.constraintString = selectedElement.constraintString;
      }
      console.log(">>> " + selectedElement.constraintString);
    }
  }

  populateFormFieldsFromProperties(propertyIds: string[], elementId: string) {
    const showAllProperties = this.settingsService.getStatus("showHiddenProperties");
    for (const propertyId of propertyIds) {
      if (showAllProperties || this.modelElementDefService.propertyIsVisible(propertyId)) {

        //Name/Title
        this.formNames.push(elementId + "-" + propertyId);
        //Default value
        const value = this.modelElementDataService.getValueForElementProperty(elementId, propertyId);
        this.formDefaults.push(value);
        //PropertyId
        this.formPropertyIds.push(propertyId);
        //ElementId
        this.formElementIds.push(elementId);

        console.log(elementId + "-" + propertyId + "-value:" + value);

      }
      else {
        console.log(propertyId + ": not visible")
      }
    }
  }
}
