import { Component, OnInit } from '@angular/core';

import { ShapeService } from '../shape.service';
import { ModelElementDataService } from '../../data-model/model-element-data.service';
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
    private shapeService: ShapeService,
    // private modelElementService: ModelElementService,
    private modelElementDataService: ModelElementDataService,
    private solverCallService: SolverCallService)
    { }

  // shapes: Shape[] = [];
  solverJsonInput = "";
  solverResults = "";

  ngOnInit(): void {
    this.getModelData();
  }

  getModelData() {
    //Start element and array of elements
    var jString = "{" + JSON.stringify("elements") + ":[";
    let modelElements = this.modelElementDataService.getModelElements();
    for (const modelElement of modelElements.filter(element => element.visible)){
      //ID
      jString += "{" + JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
      //Element type
      jString += JSON.stringify("elementTypeId") + ":" + JSON.stringify(modelElement.elementTypeId) + ",";
      //Properties
      jString += JSON.stringify("properties") + ":{";
  
      //Properties
      for (const propertyTypeId
          of this.modelElementDataService.getPropertyTypeIdsFor(modelElement.elementTypeId)) {

            let value = this.modelElementDataService.getValueForElementProperty(
              modelElement.elementId,propertyTypeId);
            jString += JSON.stringify(propertyTypeId)  + ":" + JSON.stringify(value)  + ","
      }
      //Close properties array and element to prep for next element
      jString = jString.substring(0, jString.length - 1) + "}},";
    }
    //Close elements array and element
    jString = jString.substring(0, jString.length - 1) + "]}";

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


  getModelDataOld() {
    // this.shapes = this.shapeService.getShapes();
    var modelData: Array<Object> = [];
    // var jString2 = "";
    var jString = "{" + JSON.stringify("bus1") + ":{";

    for (let shape of this.shapeService.getShapes()) {
      modelData.push({
        elementId: shape.elementId,
        busId1: (shape.connId1) ? shape.connId1 : "",
        busId2: (shape.connId2) ? shape.connId2 : ""
      });

      jString += JSON.stringify(shape.elementId)
        + ":" + JSON.stringify((shape.connId1) ? shape.connId1 : "") + ","


      // jString2 += JSON.stringify({
      //   elementId: shape.elementId,
      //   elementType: shape.elementType,
      //   bus1: shape.connId1,
      //   bus2: shape.connId2
      // });

    }
    jString = jString.substring(0, jString.length - 1) + "}}"

    this.solverJsonInput = jString;

    // let myJson = JSON.stringify(modelData);
    // console.log("json:" + myJson);
    // interface MyObj {
    //   elementId: string
    //   bus1: string
    // }

    // let obj: MyObj[] = JSON.parse(myJson);

    // for (let thisObj of obj) {
    //   console.log("parse:" + thisObj.elementId);
    // }


  }
}
