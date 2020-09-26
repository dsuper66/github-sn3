import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import {
  ModelElement,
  ElementProperties
  // ElementPropertyType, 
  // ElementVarType,
  // ElementType 
} from './model-element';

import { ModelElementDefService } from './model-element-def.service';

@Injectable({
  providedIn: 'root'
})
export class ModelElementDataService {

  constructor(
    private modelElementDefService: ModelElementDefService
  ) {

    //Manually Added Child element defintions which will
    //cause child elements to be created automatically with parent
    //--------------------------------------------------
    //Tranches
    //--------
    //Bid Tranches associated with load
    this.modelElements.push({
      elementId: 'bidTrancheDef', elementType: 'trancheDef',
      properties: this.makeDict([
        { 'parentType': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Energy Tranches associated with gen
    this.modelElements.push({
      elementId: 'enOfferTrancheDef', elementType: 'trancheDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childTypeId': 'enOfferTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Reserve Tranches associated with gen
    this.modelElements.push({
      elementId: 'resOfferTrancheDef', elementType: 'trancheDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childTypeId': 'resOfferTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Flow-Loss Tranches associated with branch
    this.modelElements.push({
      elementId: 'lossTrancheDef', elementType: 'trancheDef',
      properties: this.makeDict([
        { 'parentType': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Unrestricted Elements
    //---------------------
    //Directional branches associated with branch
    // this.modelElements.push({
    //   elementId: 'branchFlowPos', elementType: 'unrestrictedDef',
    //   properties: this.makeDict([
    //     { 'parentType': 'branch' }, { 'childTypeId': 'dirBranchPos' }, { 'childCount': '1' }]),
    //   visible: false
    // });
    this.modelElements.push({
      elementId: 'dirBranchDef', elementType: 'unrestrictedDef',
      properties: this.makeDict([
        { 'parentType': 'branch' }, { 'childTypeId': 'dirBranch' }, { 'childCount': '2' }]),
      visible: false
    });
    // //Unrestricted - bus angle
    // this.modelElements.push({
    //   elementId: 'phaseAnglePos', elementType: 'unrestrictedDef',
    //   properties: this.makeDict([
    //     { 'parentType': 'bus' }, //{ 'varId': 'phaseAngle' }, 
    //     { 'childTypeId': 'dirAnglePos' }, { 'childCount': '1' }]),
    //   visible: false
    // });
    // this.modelElements.push({
    //   elementId: 'phaseAngleNeg', elementType: 'unrestrictedDef',
    //   properties: this.makeDict([
    //     { 'parentType': 'bus' }, //{ 'varId': 'phaseAngle' }, 
    //     { 'childTypeId': 'dirAngleNeg' }, { 'childCount': '1' }]),
    //   visible: false
    // }); 

    //Static components of the model
    //mathModel has the objective as a variable
    this.modelElements.push({
      elementId: 'mathmodel001', elementType: 'mathModel',
      properties: {},
      visible: false
    });
    //island has risk and reserve as variables 
    //(static for now, but will be based on connectivity, created by saveConnectivityToModel)
    this.modelElements.push({
      elementId: 'island001', elementType: 'island',
      properties: {},
      visible: false
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

  //===DATA===

  addElement(elementId: string, elementType: string, properties: ElementProperties) {
    this.modelElements.push({
      elementId: elementId,
      elementType: elementType,
      properties: properties,
      visible: true
    });
  }

  //Child elements
  getChildElementDefs(elementType: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties['parentType'] === elementType);
  }

  getChildIdsForElementId(elementId: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties['parentId'] === elementId);
  }

  //Test - get all properties of all
  listAllElements(elementId: string): ModelElement[] {
    for (const element of this.modelElements) {
      const propertyTypeIds = this.modelElementDefService.getPropertyTypeIdsFor(element.elementType)
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
    return this.modelElements.filter(element => element.elementId === elementId)[0];
  }

  getValueForElementProperty(elementId: string, propertyType: string): string {
    let properties = this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties;
    return properties[propertyType];
  }

  getElementsWithPropertyValue(propertyType: string, value: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties[propertyType] === value);
  }

  setPropertyForElement(elementId: string, propertyType: string, value: any) {

    // if (value != undefined) {

    //Special cases
    //isRefBus... can only have one refBus so set all to false first if the new value is true
    if (propertyType === 'isRefBus' && value === 'true') {
      this.setPropertyForAllElements(propertyType, "false");
    }

    //Update the property for the element
    const elementToUpdate = this.modelElements.filter(
      element => element.elementId === elementId)[0];
    //Update if found
    if (elementToUpdate) {
      elementToUpdate.properties[propertyType] = value;
      console.log("Set property:" + propertyType + "for:" + elementId);

      //If child elements have the same property then it also gets updated
      //(i.e. fromBus and toBus for dirBranch)
      for (const childElement of this.getChildIdsForElementId(elementId)) {
        this.setPropertyForElement(childElement.elementId,propertyType,value);
      }
    }

    // }
    // else {
    //   console.log("Set property: no value");
    // }
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

}
