import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, Form, NgModel } from '@angular/forms';


//So that we can extract the i.d.
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

import { ModelElementDataService } from '../../data-model/model-element-data.service';
import { ModelElementDefService } from '../../data-model/model-element-def.service';
import { ItemType, MathModelDefService } from '../../data-model/math-model-def.service';
import { SettingsService } from '../../data-model/settings.service';
import { SolverCallService } from '../../data-model/solver-call.service';

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
    private solverCallService: SolverCallService,
    private mathModelDefService: MathModelDefService
  ) {
    route.params.subscribe(params => { this.idOfDataEntryObject = params['id']; });
  }

  ngOnInit(): void {
    const id = this.idOfDataEntryObject;
    console.log("GOT ID ", id); //this.idOfDataEntryObject);
    if (id === "element-def") {
      this.doElementDefs = true;
      this.populateFromElementDefs();
      this.backButtonRoute = "/main-component";
    }
    else if (id === "model-def") {
      this.doConstraintDefs = true;
      this.populateFromConstraintDefs();
    }
    else if (id.includes("constraintComp")) {
      this.doConstraintComps = true;
      const startPos = id.indexOf("?") + 1;
      this.populateFromConstraintComps(id.substr(startPos));
    }
    else if (id === "json-model") {
      this.doJSONModel = true;
      this.jsonModel = this.solverCallService.solverJsonInput;
    }
    else if (id === "solver-out") {
      this.doSolverOut = true;
      this.solverOutString = this.solverCallService.solverResultString;
    }
    else {
      this.doDataEntry = true;
      this.populateFromElementId(id);
      this.backButtonRoute = "/network-builder-component";
    }

  }

  doJSONModel = false;
  doSolverOut = false;
  doElementDefs = false;
  doConstraintDefs = false;
  doConstraintComps = false;
  doDataEntry = false;

  formNames: string[] = [];
  formDefaults: string[] = [];
  fieldRefIdParent: string[] = [];
  fieldRefIdChild: string[] = [];

  jsonModel = "";
  solverOutString = "";

  backButtonRoute = "";

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
  getConstraintStatus(itemId: string): boolean {
    return this.mathModelDefService.itemIsEnabled(ItemType.Constraint,itemId);
  }
  setConstraintStatus(itemId: string, isEnabled: boolean) {
    return this.mathModelDefService.setItemStatus(ItemType.Constraint, itemId, isEnabled);
  }

  //Constraint Components
  getFactorStatus(itemId: string): boolean {
    return this.mathModelDefService.itemIsEnabled(ItemType.VarFactor,itemId);
  }
  setFactorStatus(itemId: string, isEnabled: boolean) {
    return this.mathModelDefService.setItemStatus(ItemType.VarFactor, itemId, isEnabled);
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

          if (this.doDataEntry) {
            const elementId = this.fieldRefIdParent[index];
            const propertyId = this.fieldRefIdChild[index];
            this.modelElementDataService.setPropertyForElement(elementId, propertyId, formValue);
          }
          else if (this.doElementDefs) {
            const elementType = this.fieldRefIdParent[index];
            const propertyType = this.fieldRefIdChild[index];
            this.modelElementDefService.setDefaultValue(elementType, propertyType, formValue);
          }

        }
      })
    }
    //Submit also navigates back
    //this.router.navigate(['/network-builder-component']);
    this.router.navigate([this.backButtonRoute]);

  }

  pageTitle = "";

  //Element Defs  
  populateFromElementDefs() {
    this.pageTitle = "Property Defaults"
    for (const propertyDef of
      this.modelElementDefService.getDefaultSettingsAll()) {
      this.formNames.push(propertyDef.elementType + "-" + propertyDef.propertyType)
      this.formDefaults.push(propertyDef.defaultValue);

      this.fieldRefIdParent.push(propertyDef.elementType)
      this.fieldRefIdChild.push(propertyDef.propertyType)
    }
  }


  //Constraint Defs
  cdArray: string[] = [];
  ccArray: [string[]] = [[]];
  //Constraint Defs - Parent
  populateFromConstraintDefs() {
    this.pageTitle = "Constraint Definitions";
    console.log("populateFromConstraintDefs");
    const constraintDefs = this.mathModelDefService.getConstraintDefsAll();
    for (const constraintDef of constraintDefs) {
      console.log(">>>" + constraintDef.constraintType);
      this.formNames.push(constraintDef.constraintType);
    }
  }
  //Constraint Defs - Components
  populateFromConstraintComps(constraintType: string) {
    console.log("populateFromConstraintComps");
    this.pageTitle = "Constraint: " + constraintType;
    const constraintDef = this.mathModelDefService.getConstraintDef(constraintType);
    const constraintComps = this.mathModelDefService.getConstraintComps(constraintType);

    var a: string[] = [];
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
      var a: string[] = [];
      a.push("[parent var]")
      var factors = constraintDef.factorValue.toString() + " x ";
      if (constraintDef.factorProperty != "") { factors += constraintDef.factorProperty };
      a.push(factors)
      this.ccArray.push(a);
    }

    //The child vars in the equation
    for (const constraintComp of constraintComps) {
      this.formNames.push(constraintComp.elementType + "." + constraintComp.varType);
      console.log(">>>" + constraintComp.varType);
      var a: string[] = [];
      a.push("[" + constraintComp.propertyMap + "]");
      var factors = constraintComp.factorValue.toString() + " x ";
      if (constraintComp.factorProperty != "") { factors += constraintComp.factorProperty };
      if (constraintComp.factorParentProperty != "") { factors += constraintComp.factorParentProperty };
      a.push(factors);

      this.ccArray.push(a);

      // this.formNames.push("=========");
    }
  }

  //Data - data entry and results
  constraintString: string = "";
  resultString: string = "";

  populateFromElementId(elementId: string): void {
    const selectedElement = this.modelElementDataService.getModelElementForId(elementId);
    if (selectedElement) {
      //Properties for this element
      const parentProperties = this.modelElementDefService.getPropertyTypesFor(selectedElement.elementType);
      this.populateFormFieldsFromProperties(parentProperties, selectedElement.elementId);

      //Properties for child elements, e.g., dirBranch child of branch
      const childElements = this.modelElementDataService.getChildElements(elementId);
      for (const childElement of childElements) {
        const childProperties = this.modelElementDefService.getPropertyTypesFor(childElement.elementType);
        this.populateFormFieldsFromProperties(childProperties, childElement.elementId);
        //And child record can have child records, e.g., segments of dir branch
        const childChildElements = this.modelElementDataService.getChildElements(childElement.elementId);
        for (const childChildElement of childChildElements) {
          const childChildProperties = this.modelElementDefService.getPropertyTypesFor(childChildElement.elementType);
          this.populateFormFieldsFromProperties(childChildProperties, childChildElement.elementId);
        }
      }

      //Constraint string
      if (selectedElement.constraintString) {
        this.constraintString = selectedElement.constraintString;
      }
      console.log(">>> " + selectedElement.constraintString);
      //Results string
      if (selectedElement.resultString) {
        this.resultString = selectedElement.resultString;
      }

    }
  }

  // fieldIsReadOnly(propertyType: string) {
  //   return this.modelElementDefService.propertyIsReadOnly(propertyType);
  // }
  formFieldReadOnly: boolean[] = [];
  //Data entry fields (called from Data above)
  populateFormFieldsFromProperties(propertyIds: string[], elementId: string) {
    const showAllProperties = this.settingsService.getStatus("showHiddenProperties");
    for (const propertyId of propertyIds) {
      if (showAllProperties || this.modelElementDefService.propertyIsVisible(propertyId)) {

        //Name/Title
        this.formNames.push(elementId + "." + propertyId);

        //PropertyId
        this.fieldRefIdChild.push(propertyId);
        //ElementId (for assigning any data entry)
        this.fieldRefIdParent.push(elementId);

        //Default value
        const defaultValue = this.modelElementDataService.getValueForElementProperty(elementId, propertyId);
        this.formDefaults.push(defaultValue);

        //Read-only... if the property is defined as read-only, or the element has a parent
        if (this.modelElementDefService.propertyIsReadOnly(propertyId)
          || this.modelElementDataService.getValueForElementProperty(elementId,'parentId')) {
          this.formFieldReadOnly.push(true);
        }
        // else if (this.modelElementDataService.getValueForElementProperty(elementId,'parentId')) {
        //   this.formFieldReadOnly.push(true);
        // }
        else {
          this.formFieldReadOnly.push(false);  
        }

        console.log(elementId + "-" + propertyId + "-value:" + defaultValue);

      }
      else {
        console.log(propertyId + ": not visible")
      }
    }
  }
}
