import { isDefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { 
  ModelElement, 
  ElementPropertyType, 
  ElementProperties, 
  ElementVarType,
  ElementType } from './model-element';

import { ModelElementDefService } from './model-element-def.service';

@Injectable({
  providedIn: 'root'
})
export class ModelElementDataService {

  constructor(
    private modelElementDefService: ModelElementDefService 
  ) {

    //Add child element defs... elements created automatically with parent
    //parentTypeId is used to identify the parent
    //Bid Tranches
    this.modelElements.push({
      elementId: 'bidTrancheDef', elementTypeId: 'trancheDef',
      properties: this.makeDict([
        { 'parentTypeId': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Gen Tranches
    this.modelElements.push({
      elementId: 'genTrancheDef', elementTypeId: 'trancheDef',
      properties: this.makeDict([
        { 'parentTypeId': 'gen' }, { 'childTypeId': 'genTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Res Tranches
    this.modelElements.push({
      elementId: 'resTrancheDef', elementTypeId: 'trancheDef',
      properties: this.makeDict([
        { 'parentTypeId': 'gen' }, { 'childTypeId': 'resTranche' }, { 'childCount': '3' }]),
      visible: false
    });
    //Loss Tranches
    this.modelElements.push({
      elementId: 'lossTrancheDef', elementTypeId: 'trancheDef',
      properties: this.makeDict([
        { 'parentTypeId': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }]),
      visible: false
    });

    //Unrestricted - branch flow
    this.modelElements.push({
      elementId: 'branchFlowPos', elementTypeId: 'unrestrictedDef',
      properties: this.makeDict([
        { 'parentTypeId': 'branch' },  //{ 'varId': 'branchFlow' },
        { 'childTypeId': 'posFlow' }, { 'childCount': '1' }]),
      visible: false
    });
    this.modelElements.push({
      elementId: 'branchFlowNeg', elementTypeId: 'unrestrictedDef',
      properties: this.makeDict([
        { 'parentTypeId': 'branch' }, //{ 'varId': 'branchFlow' }, 
        { 'childTypeId': 'negFlow' }, { 'childCount': '1' }]),
      visible: false
    });    
    //Unrestricted - bus angle
    this.modelElements.push({
      elementId: 'phaseAnglePos', elementTypeId: 'unrestrictedDef',
      properties: this.makeDict([
        { 'parentTypeId': 'bus' }, //{ 'varId': 'phaseAngle' }, 
        { 'childTypeId': 'posAngle' }, { 'childCount': '1' }]),
      visible: false
    });
    this.modelElements.push({
      elementId: 'phaseAngleNeg', elementTypeId: 'unrestrictedDef',
      properties: this.makeDict([
        { 'parentTypeId': 'bus' }, //{ 'varId': 'phaseAngle' }, 
        { 'childTypeId': 'negAngle' }, { 'childCount': '1' }]),
      visible: false
    });    

  }

  private modelElements: ModelElement[] = [];
  private elementNextIndex = new Map<string, bigint>();

  getIdForNewElementOfType(elementTypeId: string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementTypeId] == undefined) {
      this.elementNextIndex[elementTypeId] = 1;
    }
    let elementIndex = this.elementNextIndex[elementTypeId];

    //Make the i.d.
    let newId = this.makeIdFromStringAndNumber(elementTypeId,elementIndex);
    this.elementNextIndex[elementTypeId] = elementIndex + 1;
    console.log("New Id:" + newId);
    return newId;
  }

  makeIdFromStringAndNumber(idString: string, idNumber:number) : string {
    return idString + ("000" + idNumber).slice(-3);
  }

  //Make Dictionary from array of objects
  //https://stackoverflow.com/questions/43147696/unable-to-extract-object-values-in-typescript
  makeDict(arrayOfMaps: { [key: string]: any }): { [key: string]: any } {
    const dict: { [key: string]: any } = {};

    arrayOfMaps.forEach(function (obj: { (key: string): any }) {
      Object.getOwnPropertyNames(obj).forEach(key => {
        let value = obj[key];
        console.log(key + '>>>>' + value);
        dict[key] = value;
      });
    })

    return dict;
  }
  
  //===DATA===

  addElement(elementId: string, elementTypeId: string, properties: ElementProperties) {
    this.modelElements.push({
      elementId: elementId,
      elementTypeId: elementTypeId,
      properties: properties,
      visible: true
    });
  }

  //Child elements
  getChildElementDefs(elementTypeId: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties['parentTypeId'] === elementTypeId);
  }

  getChildIdsForElementId(elementId: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties['parentId'] === elementId);
  }

  //Test - get all properties of all
  listAllElements(elementId: string): ModelElement[] {
    for (const element of this.modelElements) {
      const propertyTypeIds = this.modelElementDefService.getPropertyTypeIdsFor(element.elementTypeId)
      for (const propertyTypeId of propertyTypeIds) {
        console.log("##>>" + element.elementId + " : " + propertyTypeId + " : " + element.properties[propertyTypeId]);
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

  getValueForElementProperty(elementId: string, propertyTypeId: string): string {
    let properties = this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties;
    return properties[propertyTypeId];
  }

  getElementsWithPropertyValue(propertyTypeId: string, value: string):ModelElement[] {
    return this.modelElements.filter(
      element => element.properties[propertyTypeId] === value);
  }

  setPropertyForElement(elementId: string, propertyTypeId: string, value: any) {
    console.log("setPropertyForElement")
    if (value) {

      //Special cases
      //isRefBus... can only have one refBus so set all to false first if the new value is true
      if (propertyTypeId === 'isRefBus' && value === 'true') {
        this.setPropertyForAllElements(propertyTypeId,"false");
      }

      //Update the property for the element
      const elementToUpdate = this.modelElements.filter(
        element => element.elementId === elementId)[0];
      elementToUpdate.properties[propertyTypeId] = value;
    }
    else {
      console.log("NO VALUE");
    }
  }

  setPropertyForAllElements(propertyTypeId: string, value: any) {
    console.log("setPropertyForAllElements")
    if (value) {

      const elementsToUpdate = this.modelElements.filter(
        element => element.properties[propertyTypeId]);

      for (const elementToUpdate of elementsToUpdate) {
        console.log("update property:" + propertyTypeId + " of:" + elementToUpdate.elementTypeId + " to:" + value);
        elementToUpdate.properties[propertyTypeId] = value;
      }
    }
    else {
      console.log("NO VALUE");
    }
  }

}
