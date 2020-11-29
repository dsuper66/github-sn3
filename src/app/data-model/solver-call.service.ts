import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { MathModelDefService, ModelResults } from '../data-model/math-model-def.service';
import { ModelElementDataService } from '../data-model/model-element-data.service';
import { ModelElementDefService } from '../data-model/model-element-def.service';
import { ShapeService } from '../views/shape.service';

const headers = new HttpHeaders({
    'Content-Type':  'application/json'
    // Authorization: 'my-auth-token'
  });

export interface SolverResult {
  resultText: string;
}

export interface SolverInput {
  inputJson: string;
}


@Injectable({
  providedIn: 'root'
})
export class SolverCallService {

  constructor(
    private http: HttpClient,
    private modelElementDataService: ModelElementDataService,
    private modelElementDefService: ModelElementDefService,
    private mathModelDefService: MathModelDefService,
    private shapeService: ShapeService)
    { }

  // solverURL = 'https://shrouded-escarpment-67155.herokuapp.com/api/solve';
  solverURL = 'https://scala-solver.herokuapp.com/api/solve';

  solverJsonInput = "";
  solverResultString = "";  

  solveInProgress = false;

  sendModelToSolver(solverInput: SolverInput): Observable<ModelResults> {
    const httpOptions:Object = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      }),
      responseType: 'json'
    }
    return this.http.post<ModelResults>(
      this.solverURL, 
      solverInput.inputJson, 
      httpOptions)
      .pipe(
        //catchError(this.handleError('sendModel', hero))
      );
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
    return JSON.stringify(key) + ":" + JSON.stringify(value) + ",";
  }

  solveModel() {
    this.solveInProgress = true;
    //Open JSON
    var jString = "{"

    //Elements
    //Start elements array
    jString += this.jsonStart("elements");
    //Individual Elements    
    let modelElements = this.modelElementDataService.getModelElements();
    
    //Don't write an element that has missing properties
    const modelElementsExcluded = modelElements.filter(
      element => {
        (Object.keys(element.properties).length 
      != this.modelElementDefService.getPropertyCount(element.elementType)) 
      }
    )
    //Log what is excluded
    for (const modelElement of modelElementsExcluded) {
    console.log(">>>Excluded:" + modelElement.elementId + 
      "expected count:" + this.modelElementDefService.getPropertyCount(modelElement.elementType) +
      "but only has ");
      for (const property of Object.keys(modelElement.properties)) {
        console.log("key:" + property);
      }
    }

    //==Elements JSON==
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

    //==ConstraintDefs JSON==
    jString += this.jsonStart("constraintDefs");
    let constraintDefs = this.mathModelDefService.getConstraintDefsAll();
    for (const constraintDef of constraintDefs) {
      //Start ConstraintDef
      jString += "{";
      jString += this.jsonAddPair("constraintType", constraintDef.constraintType);
      jString += this.jsonAddPair("elementType", constraintDef.elementType);
      jString += this.jsonAddPair("varType", constraintDef.varType);
      jString += this.jsonAddPair("inEquality", constraintDef.inEquality);
      jString += this.jsonAddPair("rhsValue", constraintDef.rhsValue);      
      jString += this.jsonAddPair("rhsProperty", constraintDef.rhsProperty);      
      jString += this.jsonAddPair("factorValue", constraintDef.factorValue);
      jString += this.jsonAddPair("factorProperty", constraintDef.factorProperty);

      //Remove last comma and close constraintDef object
      jString = this.replaceLastChar(jString, ",","},");
    }
    //Remove last comma, close constraintDefs list
    jString = this.replaceLastChar(jString,",", "]");

    //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps
    jString += ",";

    //==ConstraintComps JSON==
    jString += this.jsonStart("constraintComps");
    let constraintComps = this.mathModelDefService.getConstraintCompsAll();
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

    //For display
    this.solverJsonInput = jString;

    //===SOLVE===
    //Send the model to the solver
    //https://stackoverflow.com/questions/50524711/processing-a-complex-object-by-http-get-in-angular-6
    //http://json2ts.com/

    const solverInput: SolverInput = { inputJson: jString } as SolverInput;

    this
      .sendModelToSolver(solverInput)
      .subscribe(solverResults => {
        
        //===Extract Results===
        //Save the resultType to the results array for the element
        //where resultType is either varType or constraintType

        //Empty Price and Quantity
        this.modelElementDataService.resetResults();

        //Variables
        var resultString = "\n"
        for (const modelVar of solverResults.variables) {
          resultString += (modelVar.varId + "=" + modelVar.quantity + "\n");
          this.modelElementDataService.addResult(
            modelVar.elementId,modelVar.varType,modelVar.varId,modelVar.quantity,"")
        }

        //Constraints
        resultString += "\n\n";
        for (const modelCon of solverResults.constraints) {
          resultString += (modelCon.constraintId + "=" + modelCon.shadowPrice + "\n");
          this.modelElementDataService.addResult(
            modelCon.elementId,modelCon.constraintType,modelCon.constraintId,modelCon.shadowPrice,modelCon.constraintString)
        }

        //Add the Var and Con results to the shapes
        this.shapeService.applyResultsToShapesText();

        //Constraint String
        resultString += "\n\n";
        for (const modelElement of modelElements) {
          modelElement.constraintStrings = [];
          for (const modelCon of solverResults.constraints.filter(c => c.elementId == modelElement.elementId)){            
            modelElement.constraintStrings.push(modelCon.constraintString);
            resultString += modelCon.constraintString;
            // elementConstraintString += ">";
          }
          resultString += "\n";
          console.log (">>>>>" + modelElement.constraintStrings);
        }

        //Display the resultString
        //Write to consolve
        console.log("SOLVER RESULTS:" + resultString);
        //Show on main display
        this.solverResultString = resultString;


        //Let the component know the solve is done
        this.solveInProgress = false;

      });
      

  }//done solveModel

}