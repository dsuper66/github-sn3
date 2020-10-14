import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import {
  ModelElement,
  ElementProperties,
  ElementPrices
} from './model-element';

import { ModelElementDefService } from './model-element-def.service';

@Injectable({
  providedIn: 'root'
})
export class ModelElementDataService {

  constructor(
    private modelElementDefService: ModelElementDefService
  ) {

    //Manually Add Child element defintions which will
    //cause child elements to be created automatically with parent
    //--------------------------------------------------
    //Child Tranches
    //--------------
    //Bid Tranches associated with load
    this.modelElements.push({
      elementId: 'bidTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }]),
      includeInModel: false
    });
    //Energy Tranches associated with gen
    this.modelElements.push({
      elementId: 'enOfferTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childTypeId': 'enOfferTranche' }, { 'childCount': '3' }]),
      includeInModel: false
    });
    //Reserve Tranches associated with gen
    this.modelElements.push({
      elementId: 'resOfferTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'gen' }, { 'childTypeId': 'resOfferTranche' }, { 'childCount': '3' }]),
      includeInModel: false
    });
    //Flow-Loss Tranches associated with branch
    this.modelElements.push({
      elementId: 'lossTrancheDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }]),
      includeInModel: false
    });
    //Child Unrestricted Elements
    //---------------------------
    this.modelElements.push({
      elementId: 'dirBranchDef', elementType: 'childDef',
      properties: this.makeDict([
        { 'parentType': 'branch' }, { 'childTypeId': 'dirBranch' }, { 'childCount': '2' }]),
      includeInModel: false
    });

    //Static components of the model
    //mathModel has the objective as a variable
    this.modelElements.push({
      elementId: 'mathmodel001', elementType: 'mathModel',
      properties: {},
      includeInModel: true
    });
    //island has risk and reserve as variables 
    //(static for now, but will be based on connectivity, created by saveConnectivityToModel)
    this.modelElements.push({
      elementId: 'island001', elementType: 'island',
      properties: {},
      includeInModel: true
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

    //Special Case
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
      for (const childElementWithProperty of this.getChildElements(elementId).filter(
        childElement => this.modelElementDefService.elementHasProperty(childElement,propertyType))) {

        this.setPropertyForElement(childElementWithProperty.elementId,propertyType,value);
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

  setQuantityForElement(elementId: string, varType: string, varId: string, value: number) {
    const elementToUpdate = this.modelElements.find(
      element => element.elementId === elementId);
    
    if (elementToUpdate) {
      if (!elementToUpdate.prices) {
        elementToUpdate.prices = {}        
      }
      elementToUpdate.prices[varType] = value;
      
      console.log("Element:" + elementId + " set quantity:" + value + " for:" + varType);  
    }
  }

  setPriceForElement(elementId: string, constraintType: string, constraintId: string, value: number) {
    const elementToUpdate = this.modelElements.find(
      element => element.elementId === elementId);
    
    if (elementToUpdate) {
      if (!elementToUpdate.quantities) {
        elementToUpdate.quantities = {}        
      }
      elementToUpdate.quantities[constraintId] = value;
      
      console.log("Element:" + elementId + " set price:" + value + " for:" + constraintType);  
    }
  }

  getPrice(elementId: string): string {
    let element = this.modelElements.find(
      element => element.elementId === elementId
    );
    const prices = element?.prices
    if (prices) {
      return prices['nodeBal'].toString()
    }
    else {
      return "ppp"
    };
  }

}
