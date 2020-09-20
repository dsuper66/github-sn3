import { Component, OnInit } from '@angular/core';

// import { ShapeService } from '../shape.service';

import { ModelElementDataService } from '../../data-model/model-element-data.service';
import { ModelElementDefService } from '../../data-model/model-element-def.service';
import { MathModelDefService } from '../../data-model/math-model-def.service';


import { Shape } from '../shape';
import { ModelElement } from '../../data-model/model-element'
import { SolverCallService } from '../../data-model/solver-call.service';
import { SolverInput } from '../../data-model/solver-call.service';


@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  constructor(
    // private shapeService: ShapeService,
    // private modelElementService: ModelElementService,
    private modelElementDataService: ModelElementDataService,
    private modelElementDefService: ModelElementDefService,
    private mathModelDefService: MathModelDefService,
    private solverCallService: SolverCallService) { }

  // shapes: Shape[] = [];
  solverJsonInput = "";
  solverResults = "";

  ngOnInit(): void {
    this.getModelData();
  }

  jsonStart(sectionName: string) {
    return JSON.stringify(sectionName) + ":[";
  }

  replaceLastChar(stringIn: string, newChar: string) {
    if (stringIn.length > 0) {
      return stringIn.substring(0, stringIn.length - 1) + newChar;
    }
    else {
      return stringIn;
    }
  }

  jsonAddPair(key: string, value: any) {
    // JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
    return JSON.stringify(key) + ":" + JSON.stringify(value) + ",";
  }

  getModelData() {

    //Open JSON
    var jString = "{"

    //Elements
    //Start elements array
    // var jString = "{" + JSON.stringify("elements") + ":[";
    jString += this.jsonStart("elements");
    //Individual Elements    
    let modelElements = this.modelElementDataService.getModelElements();
    for (const modelElement of modelElements.filter(element => element.visible)) {

      //Start Element
      jString += "{";
      //ID
      jString += JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
      //Element type
      jString += JSON.stringify("elementTypeId") + ":" + JSON.stringify(modelElement.elementTypeId) + ",";
      //Properties 
      jString += JSON.stringify("properties") + ":{";
      for (const propertyTypeId
        of this.modelElementDefService.getPropertyTypeIdsFor(modelElement.elementTypeId)) {

        let value = this.modelElementDataService.getValueForElementProperty(
          modelElement.elementId, propertyTypeId);
        jString += JSON.stringify(propertyTypeId) + ":" + JSON.stringify(value) + ","
      }
      //Remove the last comma and close properties object and close element object
      // jString = jString.substring(0, jString.length - 1) + "}},";
      jString = this.replaceLastChar(jString, "}") + "},";
    }
    //Remove last comma and close Elements list
    jString = this.replaceLastChar(jString, "]");
    // jString = jString.substring(0, jString.length - 1) + "]}";

    //Next "object"...  Elements "," ConstraintDefs
    jString += ",";

    //ConstraintDefs
    jString += this.jsonStart("constraintDefs");
    let constraintDefs = this.mathModelDefService.getConstraintDefs();
    for (const constraintDef of constraintDefs) {
      //Start ConstraintDef
      jString += "{";
      jString += this.jsonAddPair("constraintId", constraintDef.constraintId);
      jString += this.jsonAddPair("elementType", constraintDef.elementType);
      jString += this.jsonAddPair("varType", constraintDef.varType);
      jString += this.jsonAddPair("inEquality", constraintDef.inEquality);
      jString += this.jsonAddPair("rhsProperty", constraintDef.rhsProperty);
      jString += this.jsonAddPair("rhsValue", constraintDef.rhsValue);

      //Remove last comma and close constraintDef object
      jString = this.replaceLastChar(jString, "},");
    }
    //Remove last comma, close constraintDefs list
    jString = this.replaceLastChar(jString, "]");

    //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps
    jString += ",";

    //ConstraintComps
    jString += this.jsonStart("constraintComps");
    let constraintComps = this.mathModelDefService.getConstraintComps();
    for (const constraintComp of constraintComps) {
      //Start ConstraintComps
      jString += "{";
      jString += this.jsonAddPair("constraintId", constraintComp.constraintId);
      jString += this.jsonAddPair("elementType", constraintComp.elementType);
      jString += this.jsonAddPair("propertyMapToParent", constraintComp.propertyMapToParent);
      jString += this.jsonAddPair("varType", constraintComp.varType);
      jString += this.jsonAddPair("multParentProperty", constraintComp.multParentProperty);
      jString += this.jsonAddPair("multValue", constraintComp.multValue);

      //Remove last comma and close constraintComp object
      jString = this.replaceLastChar(jString, "},");
    }
    //Remove last comma, close constraintComps list
    jString = this.replaceLastChar(jString, "]");


    //Close JSON
    jString += "}";

    this.solverJsonInput = jString;

    //Send the model to the solver
    const solverInput: SolverInput = { inputJson: jString } as SolverInput;

    this.solverCallService
      .sendModelToSolver(solverInput)
      .subscribe(solverResults => {
        console.log("SOLVER RESULTS:" + solverResults);
        this.solverResults = solverResults;
      });
  }

}
