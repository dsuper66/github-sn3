import { Component, OnInit } from '@angular/core';

// import { ShapeService } from '../shape.service';

import { ModelElementDataService } from '../../data-model/model-element-data.service';
import { ModelElementDefService } from '../../data-model/model-element-def.service';
import { MathModelDefService, ModelVariable, ModelConstraint, ModelResults } from '../../data-model/math-model-def.service';


import { Shape } from '../shape';
import { ModelElement } from '../../data-model/model-element'
import { SolverCallService } from '../../data-model/solver-call.service';
import { SolverInput } from '../../data-model/solver-call.service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';


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
  solverResultString = "";

  ngOnInit(): void {
    this.getModelData();
  }

  jsonStart(sectionName: string) {
    return JSON.stringify(sectionName) + ":[";
  }

  replaceLastChar(stringIn: string, expectedLastChar: string, newLastChar: string) {
    var returnString = stringIn;
    if (stringIn.length > 0) {
      //Check that the last char is what we expect
      if (stringIn.substring(stringIn.length - 1, stringIn.length) === expectedLastChar) {
        //Replace the last char
        returnString = stringIn.substring(0, stringIn.length - 1) + newLastChar;
      } 
      else {
        //Add the last char
        returnString = stringIn + newLastChar;
      }     
    }
    return returnString;
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
    
    //Don't write an element that has missing properties
    const modelElementsExcluded = modelElements.filter(
      element => ((Object.keys(element.properties).length 
      != this.modelElementDefService.getPropertyCount(element.elementType)) 
      ) 
    )
    for (const modelElement of modelElementsExcluded) {
    console.log(">>>Excluded:" + modelElement.elementId + " only has ");
      for (const property of Object.keys(modelElement.properties)) {
        console.log("key:" + property);
      }
    }

    //Write all the elements
    for (const modelElement of modelElements.filter(
      element => element.includeInModel 
      && !(modelElementsExcluded.map(element => element.elementId).includes(element.elementId)))) 
    {

      console.log("write: " + modelElement.elementId);
      //Start this Element
      jString += "{";
      //ID
      jString += JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
      //Element type
      jString += JSON.stringify("elementType") + ":" + JSON.stringify(modelElement.elementType) + ",";
      //Properties 
      jString += JSON.stringify("properties") + ":{";
      for (const propertyType
        of this.modelElementDefService.getPropertyTypesFor(modelElement.elementType)) {

        let value = this.modelElementDataService.getValueForElementProperty(modelElement.elementId, propertyType);
        //Don't write undefined values, e.g., tranches with no data
        if (value != undefined) {
          jString += JSON.stringify(propertyType) + ":" + JSON.stringify(value) + ","
        }
      }
      //Remove the last comma and close properties object
      jString = this.replaceLastChar(jString, ",","}");
      //Close element object
      jString += "},";
    }
    //Remove last comma and close Elements list
    jString = this.replaceLastChar(jString,",", "]");
    // jString = jString.substring(0, jString.length - 1) + "]}";

    //Next "object"...  Elements "," ConstraintDefs
    jString += ",";

    //ConstraintDefs
    jString += this.jsonStart("constraintDefs");
    let constraintDefs = this.mathModelDefService.getConstraintDefs();
    for (const constraintDef of constraintDefs) {
      //Start ConstraintDef
      jString += "{";
      jString += this.jsonAddPair("constraintType", constraintDef.constraintType);
      jString += this.jsonAddPair("elementType", constraintDef.elementType);
      jString += this.jsonAddPair("varType", constraintDef.varType);
      jString += this.jsonAddPair("inEquality", constraintDef.inEquality);
      jString += this.jsonAddPair("rhsProperty", constraintDef.rhsProperty);
      jString += this.jsonAddPair("rhsValue", constraintDef.rhsValue);
      jString += this.jsonAddPair("factorProperty", constraintDef.factorProperty);

      //Remove last comma and close constraintDef object
      jString = this.replaceLastChar(jString, ",","},");
    }
    //Remove last comma, close constraintDefs list
    jString = this.replaceLastChar(jString,",", "]");

    //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps
    jString += ",";

    //ConstraintComps
    jString += this.jsonStart("constraintComps");
    let constraintComps = this.mathModelDefService.getConstraintComps();
    for (const constraintComp of constraintComps) {
      //Start ConstraintComps
      jString += "{";
      jString += this.jsonAddPair("constraintType", constraintComp.constraintType);
      jString += this.jsonAddPair("elementType", constraintComp.elementType);
      jString += this.jsonAddPair("propertyMap", constraintComp.propertyMap);
      jString += this.jsonAddPair("varType", constraintComp.varType);
      jString += this.jsonAddPair("factorParentProperty", constraintComp.factorParentProperty);
      jString += this.jsonAddPair("factorValue", constraintComp.factorValue);
      jString += this.jsonAddPair("factorProperty", constraintComp.factorProperty);

      //Remove last comma and close constraintComp object
      jString = this.replaceLastChar(jString,",", "},");
    }
    //Remove last comma, close constraintComps list
    jString = this.replaceLastChar(jString,",", "]");


    //Close JSON
    jString += "}";

    this.solverJsonInput = jString;

    //Send the model to the solver
    //https://stackoverflow.com/questions/50524711/processing-a-complex-object-by-http-get-in-angular-6
    //http://json2ts.com/

    const solverInput: SolverInput = { inputJson: jString } as SolverInput;
    this.solverCallService
      .sendModelToSolver(solverInput)
      .subscribe(solverResults => {
        
        //Empty Price and Quq=antity


        //Variables
        var resultString = "\n"
        for (const modelVar of solverResults.variables) {
          resultString += (modelVar.varId + "=" + modelVar.quantity + "\n");
          this.modelElementDataService.setQuantityForElement(
            modelVar.elementId,modelVar.varId,modelVar.quantity) 
        }

        //Constraints
        resultString += "\n\n";
        for (const modelCon of solverResults.constraints) {
          resultString += (modelCon.constraintId + "=" + modelCon.shadowPrice + "\n");
          this.modelElementDataService.setPriceForElement(
            modelCon.elementId,modelCon.constraintId,modelCon.shadowPrice) 
        }

        console.log("SOLVER RESULTS:" + resultString);
        this.solverResultString = resultString;
      });
  }

}
