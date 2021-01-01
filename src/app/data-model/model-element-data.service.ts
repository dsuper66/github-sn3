import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import {
  ModelElement,
  ElementProperties,
  // ElementPrices
} from './model-element';

import { ModelElementDefService } from './model-element-def.service';

@Injectable({
  providedIn: 'root'
})
export class ModelElementDataService {

  constructor(
    private modelElementDefService: ModelElementDefService
  ) {

    //ElementDef elements that define a relationship between elements...
    //The model elements (branch, bus, etc) are added by the user
    //There are also the following "singleton" ElementDef elements
    //These are manually added here
    //They will cause child elements to be created automatically when the parent element is added
    //--------------------------------------------------
    //Child Tranches
    //--------------
    //Bid Tranches associated with load
    this.modelElements.push({
      elementId: 'bidTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Energy Tranches associated with gen
    this.modelElements.push({
      elementId: 'enOfferTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childTypeId': 'enOfferTranche' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Reserve Tranches associated with gen
    this.modelElements.push({
      elementId: 'resOfferTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childTypeId': 'resOfferTranche' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Flow-Loss Segments associated with directional branch
    this.modelElements.push({
      elementId: 'flowLossSegmentDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'dirBranch' }, { 'childTypeId': 'flowLossSegment' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Child Unrestricted Elements
    //---------------------------
    //(2 child records... a forward direction and a reverse)
    this.modelElements.push({
      elementId: 'dirBranchDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'branch' }, { 'childTypeId': 'dirBranch' }, { 'childCount': '2' }]),
      includeInModel: false
    });

    //Static components of the model
    //mathModel has the objective as a variable
    // this.modelElements.push({
    //   elementId: 'mathmodel001', elementType: 'mathModel',
    //   properties: {},
    //   includeInModel: true
    // });
    //island has risk and reserve as variables 
    //(static for now, but will be based on connectivity, created by saveConnectivityToModel)
    // this.modelElements.push({
    //   elementId: 'island001', elementType: 'island',
    //   properties: {},
    //   includeInModel: true
    // });

  }

  private modelElements: ModelElement[] = [];
  private elementNextIndex = new Map<string, bigint>();

  getIdForNewElementOfType(elementType: string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementType] == undefined) {
      this.elementNextIndex[elementType] = 1;
    }
    let elementIndex = this.elementNextIndex[elementType];

    //Make the i.d.
    let newId = this.makeIdFromStringAndNumber(elementType, elementIndex);
    this.elementNextIndex[elementType] = elementIndex + 1;
    console.log("New Id:" + newId);
    return newId;
  }

  makeIdFromStringAndNumber(idString: string, idNumber: number): string {
    return idString + ("000" + idNumber).slice(-3);
  }

  //Make Dictionary from array of objects
  //https://stackoverflow.com/questions/43147696/unable-to-extract-object-values-in-typescript
  makeDict(arrayOfMaps: { [key: string]: any }): { [key: string]: any } {
    const dict: { [key: string]: any } = {};

    arrayOfMaps.forEach(function (obj: { (key: string): any }) {
      Object.getOwnPropertyNames(obj).forEach(key => {
        let value = obj[key];
        //console.log(key + '>>>>' + value);
        dict[key] = value;
      });
    })

    return dict;
  }

  //==========
  //   DATA
  //==========

  //Add element
  addElement(elementId: string, elementType: string, properties: ElementProperties) {
    this.modelElements.push({
      elementId: elementId,
      elementType: elementType,
      properties: properties,
      includeInModel: true
    });
  }

  //Delete element
  deleteElement(elementId: string) {
    this.modelElements = this.modelElements.filter(
      e => e.elementId != elementId && e.properties['parentId'] != elementId)
  }

  //Get child elements
  getChildElementDefs(elementType: string): ModelElement[] {
    return this.modelElements.filter(e => e.properties['parentType'] === elementType);
  }
  getChildElements(elementId: string): ModelElement[] {
    return this.modelElements.filter(e => e.properties['parentId'] === elementId);
  }

  //Test - get all properties of all
  listAllElements(elementId: string): ModelElement[] {
    for (const element of this.modelElements) {
      const propertyTypeIds = this.modelElementDefService.getPropertyTypesFor(element.elementType)
      for (const propertyType of propertyTypeIds) {
        console.log("##>>" + element.elementId + " : " + propertyType + " : " + element.properties[propertyType]);
      }
    }
    return this.modelElements.filter(
      element => element.properties['parentId'] === elementId);
  }

  getModelElements(): ModelElement[] {
    return this.modelElements;
  }

  getModelElementForId(elementId: string): ModelElement | undefined {
    return this.modelElements.filter(e => e.elementId === elementId)[0];
  }

  getModelElementOfType(elementType: string): ModelElement[] {
    return this.modelElements.filter(e => e.elementType === elementType);
  }

  getValueForElementProperty(elementId: string, propertyType: string): string {
    let properties = this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties;
    return properties[propertyType];
  }

  //Sum the child element properties, e.g., sum the bid quantities
  sumForChildren(elementId: string, childElementType: string, childPropertyType: string): number {
    const childElements = this.modelElements.filter(e =>
      e.properties['parentId'] == elementId
      && e.elementType == childElementType)
    let sum = 0.0;
    for (const e of childElements) {
      const value = e.properties[childPropertyType]
      if (value) {
        sum += value;
      }
    }
    return sum;
  }

  getElementsWherePropertyValue(propertyType: string, value: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties[propertyType] === value);
  }


  setPropertyForElement(elementId: string, propertyType: string, value: any) {

    //Special Case
    //isRefBus... can only have one refBus so set all to false first if the new value is true
    if (propertyType === 'isRefBus' && value === 'true') {
      this.setPropertyForAllElements(propertyType, "false");
    }

    //Special Case
    //resistance... use this to populate the flow loss segments
    if (propertyType === 'resistance') {
      const flowMax = Number(this.getValueForElementProperty(elementId, 'flowMax'));
      const resistance = Number(value);

      //Get dirBranches, then set the segment properties
      const dirBranches = this.getChildElements(elementId).filter(e => e.elementType == 'dirBranch');
      for (const dirBranch of dirBranches) {
        const segments = this.getChildElements(dirBranch.elementId).filter(e => e.elementType == 'flowLossSegment');
        const segFlowLimit = flowMax / segments.length; //equal length segments
        var startPointFlow = 0.0;
        var endPointFlow = segFlowLimit;
        for (const segment of segments) {
          //Flow limit
          this.setPropertyForElement(segment.elementId, 'segFlowLimit', segFlowLimit);
          //Loss flow ratio
          const startPointLosses = startPointFlow * startPointFlow * resistance;
          const endPointLosses = endPointFlow * endPointFlow * resistance;
          const lossFlowRatio = (endPointLosses-startPointLosses)/segFlowLimit;
          this.setPropertyForElement(segment.elementId, 'lossFlowRatio', lossFlowRatio);
          //For next segment
          startPointFlow = endPointFlow;
          endPointFlow += segFlowLimit;
          console.log("Segment for " + elementId + " flow loss ratio " + lossFlowRatio + " 1:" + startPointLosses + " 2:" + endPointLosses);
        }
      }
    }

    //Update the property for the element
    const elementToUpdate = this.modelElements.filter(
      element => element.elementId === elementId)[0];

    //Update if found
    if (elementToUpdate) {
      elementToUpdate.properties[propertyType] = value;
      console.log("Set property:" + propertyType + " for:" + elementId + " as:" + value);

      //If child elements have the same property then it also gets updated
      //(i.e. fromBus and toBus for dirBranch)
      for (const childElementWithProperty of this.getChildElements(elementId).filter(
        childElement => this.modelElementDefService.elementHasProperty(childElement, propertyType))) {

        this.setPropertyForElement(childElementWithProperty.elementId, propertyType, value);
      }
    }
  }

  setPropertyForAllElements(propertyType: string, value: any) {
    console.log("setPropertyForAllElements")
    if (value) {

      const elementsToUpdate = this.modelElements.filter(
        element => element.properties[propertyType]);

      for (const elementToUpdate of elementsToUpdate) {
        console.log("update property:" + propertyType + " of:" + elementToUpdate.elementType + " to:" + value);
        elementToUpdate.properties[propertyType] = value;
      }
    }
    else {
      console.log("NO VALUE");
    }
  }

  //=============
  //   RESULTS
  //=============

  //All values (prices and quantities) are stored in the results array of the element
  //indexed by a string which is either the name of the constraint or variable

  resetResults() {
    for (const e of this.modelElements) {
      // for (const price in element.prices) element.prices[price] = 0
      // for (const quantity in element.quantities) element.quantities[quantity] = 0
      e.results = {};
      // for (const result in e.results) e.results[result] = 0
      e.constraintString = ""
      e.resultString = ""
    }
  }

  private resultsDP = 2;

  //Extract results from dictionary and format as string
  //For exceptions, e.g., risk deficit or uncleared load, only want to show if non-zero
  getResultString(key: string, results: { [resultType: string]: number }, prefix = "", showZero = true): string {
    const value = results[key];
    if (value === undefined) {
      console.log("MISSING RESULT: " + key)
      return " none"; //key
    }
    else {
      if (showZero || value != 0) {
        return prefix + value.toFixed(this.resultsDP).toString();
      }
      else {
        return "";
      }
    }
  }

  // getResultVal(key: string, results: {[resultType:string] : number}):number {
  //   if (results[key] === undefined) {
  //     console.log("MISSING RESULT: " + key)
  //     return -9999.0
  //   }
  //   else {
  //     return results[key];
  //   }
  // }

  private prevObjectiveVal = 0.0;
  //Result string for display... for the element get pre-determined result types
  //(where a result type is either a constraintType or varType) as an array of strings
  getTextFromElementResults(elementId: string): [string, string, string, string] {
    var resultString1 = ""
    var resultString2 = ""
    var resultString3 = ""
    var resultString4 = ""
    let element = this.modelElements.find(
      element => element.elementId === elementId
    );
    if (element) {
      const results = element.results
      if (results) {
        if (element.elementType == "bus") {
          resultString1 = "$" + this.getResultString('nodeBal', results); //results['nodeBal'].toFixed(2).toString();  
          resultString2 = "∠" + this.getResultString('phaseAnglePos', results);
        }
        else if (element.elementType == "gen") {
          resultString1 = this.getResultString('enTrancheCleared', results);
          resultString2 = "res:" + this.getResultString('resTrancheCleared', results);
          resultString3 = this.getResultString('genResShortfall', results, "-risk:", false);
        }
        else if (element.elementType == "load") {
          resultString1 = this.getResultString('bidTrancheCleared', results);
          //Calc uncleared
          const bidsCleared = results['bidTrancheCleared'];
          if (bidsCleared) {
            const uncleared =
              this.sumForChildren(elementId, 'bidTranche', 'trancheLimit') - bidsCleared;
            //Only display if uncleared is > 0
            if (uncleared > 0) {
              resultString2 = "(" + uncleared.toFixed(this.resultsDP).toString() + ")";
            }
          }
        }
        else if (element.elementType == "island") {
          resultString1 = "res$:" + this.getResultString('resCover', results);
          resultString2 = "risk:" + this.getResultString('islandRisk', results);
          resultString3 = "res:" + this.getResultString('islandRes', results);
          resultString4 = this.getResultString('islandResShortfall', results, "-risk:", false);
        }
        else if (element.elementType == "mathModel") {
          var objectiveVal = results['objectiveVal']; //this.getResultVal('objectiveVal',results);
          if (objectiveVal) {
            const deltaObjectiveVal = objectiveVal - this.prevObjectiveVal;
            this.prevObjectiveVal = objectiveVal;
            resultString1 = "objVal:" + this.getResultString('objectiveVal', results);
            resultString2 = "prev:" + objectiveVal.toFixed(this.resultsDP).toString();
            resultString3 = "delta:" + deltaObjectiveVal.toFixed(this.resultsDP).toString();
          }
        }
        else if (element.elementType == "branch") {
          resultString1 = this.getResultString('branchFlow', results);
          resultString2 = (results['branchFlow'] - results['branchLoss']).toFixed(this.resultsDP).toString();

          //Determine direction of flow arrow
          const branchFlow = results['branchFlow']; //this.getResultVal('branchFlow',results);
          if (branchFlow) {
            if (branchFlow > 0) {
              resultString3 = '1';
            }
            else if (branchFlow < 0) {
              resultString3 = '2';
            }
            else {
              resultString3 = '0';
            }
          }
        }
      }
    }
    // }
    console.log("got result:>>" + resultString2 + "<<");
    return [resultString1, resultString2, resultString3, resultString4];
  }

  //The results are the shadow price of every constraint and the value of every variable
  //...to get the result we just need the constraintType or varType string
  addResult(elementId: string, resultType: string, resultId: string, value: number,
    constraintString: string, resultString: string) {

    console.log("Element:" + elementId + " add result:" + value + " for result type:>>" + resultType + "<<");

    //Get the element
    const elementToUpdate = this.modelElements.find(
      element => element.elementId === elementId);

    if (elementToUpdate) {

      //Add the arrays if they does not exist
      // if (!elementToUpdate.results) {
      //   elementToUpdate.results = {}        
      // }
      // if (!elementToUpdate.constraintString) {
      //   elementToUpdate.constraintString = ""        
      // }
      // if (!elementToUpdate.resultString) {
      //   elementToUpdate.resultString = ""        
      // }             

      //Special case
      //Node balance LTE constraint shadow price is negative
      if (resultType == "nodeBal" && resultId.includes("LTE")) {
        value *= -1.0;
      }
      //Directional results
      const direction = this.getValueForElementProperty(elementId, 'direction');
      if (direction) {
        value *= Number(direction);
      }


      //The value adds to any existing value with the same key
      //(e.g. cleared offers add up at the parent level)
      if (elementToUpdate.results) {
        if (elementToUpdate.results[resultType]) {
          elementToUpdate.results[resultType] = elementToUpdate.results[resultType] + value;
        }
        else {
          elementToUpdate.results[resultType] = value;
        }
      }

      //ConstraintString is empty for var result
      if (constraintString != "") {
        elementToUpdate.constraintString += "\n\n" + constraintString;
      }
      elementToUpdate.resultString += "\n" + resultString;

      //If element has a parent then also add the result to the parent
      const parentId = elementToUpdate.properties["parentId"]
      if (parentId) {
        this.addResult(parentId, resultType, resultId, value, constraintString, resultString)
      }
    }
  }


}
