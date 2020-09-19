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
    private solverCallService: SolverCallService)
    { }

  // shapes: Shape[] = [];
  solverJsonInput = "";
  solverResults = "";

  ngOnInit(): void {
    this.getModelData();
  }

  getModelData() {

    //Start elements array
    var jString = "{" + JSON.stringify("elements") + ":[";

    //Individual Elements    
    let modelElements = this.modelElementDataService.getModelElements();
    for (const modelElement of modelElements.filter(element => element.visible)){

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
              modelElement.elementId,propertyTypeId);
            jString += JSON.stringify(propertyTypeId)  + ":" + JSON.stringify(value)  + ","
      }
      //Close properties object and close element object
      jString = jString.substring(0, jString.length - 1) + "}},";
    }
    //Close elements array
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

}
