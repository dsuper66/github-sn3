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
        { 'parentType': 'load' }, { 'childType': 'bidTranche' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Energy Tranches associated with gen
    this.modelElements.push({
      elementId: 'enOfferTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childType': 'enOfferTranche' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Reserve Tranches associated with gen
    this.modelElements.push({
      elementId: 'resOfferTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childType': 'resOfferTranche' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Flow-Loss Segments associated with directional branch
    this.modelElements.push({
      elementId: 'flowLossSegmentDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'dirBranch' }, { 'childType': 'flowLossSegment' }, { 'childCount': '2' }]),
      includeInModel: false
    });
    //Child Unrestricted Elements
    //---------------------------
    //(2 child records... a forward direction and a reverse)
    this.modelElements.push({
      elementId: 'dirBranchDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'branch' }, { 'childType': 'dirBranch' }, { 'childCount': '2' }]),
      includeInModel: false
    });

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

  getElementType(elementId:string):string {
    const element = this.modelElements.find(
      element => element.elementId === elementId
    );
    if (element) {
      return element.elementType;
    }
    else {
      return "";
    }    
  }  

  //Connection count - for deciding where to connect shapes to bus
  getConnectionCountBr(elementId: string): number {
    return this.modelElements.filter(e =>
      e.elementType === 'branch' &&
      (e.properties['fromBus'] === elementId
        || e.properties['toBus'] === elementId)).length
  }
  //Get connected branches, for layout
  getBusConnections(elementId: string, elementTypes: string[]): string[] {
    console.log("elementTypes:" + elementTypes);
    const connectedBr = this.modelElements.filter(e =>
      elementTypes.includes(e.elementType) &&
      (e.properties['fromBus'] === elementId
        || e.properties['toBus'] === elementId));
    return connectedBr.map(br => br.elementId);
  }

  //Delete element
  deleteElement(elementId: string) {
    this.modelElements = this.modelElements.filter(
      e => e.elementId != elementId && e.properties['parentId'] != elementId)
  }

  //Get child / parent elements
  getChildElementDefs(elementType: string): ModelElement[] {
    return this.modelElements.filter(e => e.properties['parentType'] === elementType);
  }
  getChildElements(elementId: string): ModelElement[] {
    return this.modelElements.filter(e => e.properties['parentId'] === elementId);
  }
  parentHasProperty(elementId: string, propertyType: string): boolean {
    const parentId = this.getValueForElementProperty(elementId, 'parentId');
    if (parentId === "") {
      return false;
    }
    else {
      const value = this.getValueForElementProperty(parentId, propertyType);
      return (value != "");
    }
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
    let element = this.modelElements.find(element => element.elementId === elementId);
    if (element && element.properties[propertyType]) {
      console.log("found value:" + element.properties[propertyType] + " for:" + elementId);
      return element.properties[propertyType];
    }
    else {
      console.log("did not find:" + propertyType + " for:" + elementId);
      return "";
    }
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

    //Update the property for the element
    const elementToUpdate = this.modelElements.filter(
      element => element.elementId === elementId)[0];

    //Update if found
    if (elementToUpdate) {

      //Set the value
      elementToUpdate.properties[propertyType] = value;
      console.log("For:" + elementToUpdate.elementId + " set:" + propertyType + " to:" + value);

      //Special Case
      //isRefBus... can only have one refBus so set all to false first if the new value is true
      //###Currently REFBUS is not used###
      /*
      if (propertyType === 'isRefBus' && value === 'true') {
        console.log("RESET ALL REFBUS");
        this.setPropertyForAllElements(propertyType, 'false', elementToUpdate.elementId);
        console.log("DONE RESET");
      }*/

      //Special Case
      //resistance... use this to populate the flow loss segments
      if (propertyType === 'resistance' || propertyType === 'flowMax') {
        const flowMax = Number(this.getValueForElementProperty(elementId, 'flowMax'));
        const resistance = Number(this.getValueForElementProperty(elementId, 'resistance'));

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
            const lossFlowRatio = (endPointLosses - startPointLosses) / segFlowLimit;
            this.setPropertyForElement(segment.elementId, 'lossFlowRatio', lossFlowRatio);
            //For next segment
            startPointFlow = endPointFlow;
            endPointFlow += segFlowLimit;
            // console.log("Segment for " + elementId + " flow loss ratio " + lossFlowRatio + " 1:" + startPointLosses + " 2:" + endPointLosses);
          }
        }
      }

      //If child elements have the same property then it also gets updated
      //(i.e. fromBus and toBus for dirBranch)
      for (const childElement of this.getChildElements(elementId).filter(
        c => this.modelElementDefService.elementHasProperty(c, propertyType))) {

        //Special Case
        //fromBus, toBus for Neg flow direction is opposite
        if (propertyType == 'fromBus' || propertyType == 'toBus') {
          if (this.getValueForElementProperty(childElement.elementId, 'direction') == '-1') {
            // console.log("###Flipping from and to for:" + childElement.elementId + " child of:" + elementToUpdate.elementId);
            if (propertyType == 'toBus') {
              propertyType = 'fromBus';
            }
            else if (propertyType == 'fromBus') {
              propertyType = 'toBus';
            }
          }
        }
        console.log("set child elements for:" + elementId + " child element:" + childElement.elementId);
        this.setPropertyForElement(childElement.elementId, propertyType, value);
      }
    }
  }

  //=============
  //   RESULTS
  //=============

  //All values (prices and quantities) are stored in the results array of the element
  //indexed by a string which is either the name of the constraint or variable

  resetResults() {
    for (const e of this.modelElements) {
      e.results = {};
      e.constraintString = ""
      e.resultString = ""
    }
  }
  
  getResultsDict(elementId: string): {[resultType:string] : number}|undefined {
    const element = this.modelElements.find(
      element => element.elementId === elementId
    );
    if (element) {
      return element.results;
    }
    else {
      return undefined;
    }
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

      //Special case
      //Node balance LTE constraint shadow price is negative
      if (resultType == "nodeBal" && resultId.includes("LTE")) {
        value *= -1.0;
      }
      //Directional results, e.g., for branch arrow
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
