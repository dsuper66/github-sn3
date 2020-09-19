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

    // //Property Types (and Defaults)
    // this.elementPropertyTypes.push(
    //   { propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: 'false', visible: true },
    //   { propertyTypeId: 'fromBus', primitiveType: 'string', defaultValue: 'none', visible: false },
    //   { propertyTypeId: 'toBus', primitiveType: 'string', defaultValue: 'none', visible: false },
    //   { propertyTypeId: 'flowMax', primitiveType: 'number', defaultValue: '100', visible: true },
    //   { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10', visible: true },
    //   { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001', visible: true },
    //   { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3', visible: false },
    //   { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none', visible: false },
    //   { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none', visible: false },
    //   { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none', visible: false },
    //   { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80', visible: true },
    //   { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100', visible: true },
    //   { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90', visible: true },
    //   { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10', visible: true },
    //   { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70', visible: true },
    //   { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150', visible: true },
    //   { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25', visible: true },
    //   { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2', visible: true },
    //   { propertyTypeId: 'capacityMax', primitiveType: 'number', defaultValue: '100', visible: true }
    //   // { propertyTypeId: 'posMult', primitiveType: 'number', defaultValue: '1', visible: true },
    //   // { propertyTypeId: 'negMult', primitiveType: 'number', defaultValue: '-1', visible: true }
    // )

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


    // //Element Types and Property Types
    // //Parent elements
    // this.elementTypeProperties['bus'] = ['isRefBus'];
    // this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'flowMax', 'susceptance'];
    // this.elementTypeProperties['gen'] = ['toBus', 'capacityMax'];
    // this.elementTypeProperties['load'] = ['fromBus'];
    // //Element that defines a child
    // this.elementTypeProperties['childDef'] = ['parentTypeId', 'childTypeId', 'childCount'];
    // //Child elements - tranches
    // this.elementTypeProperties['bidTranche'] = ['parentId', 'bidLimit', 'bidPrice'];
    // this.elementTypeProperties['genTranche'] = ['parentId', 'genLimit', 'genPrice'];
    // this.elementTypeProperties['resTranche'] = ['parentId', 'resLimit', 'resPrice'];
    // this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
    // //Child elements - unrestricted variables
    // this.elementTypeProperties['posFlow'] = ['parentId'];
    // this.elementTypeProperties['negFlow'] = ['parentId'];    
    // this.elementTypeProperties['posAngle'] = ['parentId'];
    // this.elementTypeProperties['negAngle'] = ['parentId'];

    // //Element Types and Variables
    // this.elementTypeVarTypes['bus'] = ['phaseAngle'];
    // this.elementTypeVarTypes['posAngle'] = ['phaseAngle'];
    // this.elementTypeVarTypes['negAngle'] = ['phaseAngle'];    
    // this.elementTypeVarTypes['branch'] = ['branchFlow'];
    // this.elementTypeVarTypes['posFlow'] = ['branchFlow'];
    // this.elementTypeVarTypes['negFlow'] = ['branchFlow'];
    // this.elementTypeVarTypes['gen'] = ['genCleared'];
    // this.elementTypeVarTypes['load'] = ['loadCleared'];
  }

  // private elementPropertyTypes: ElementPropertyType[] = [];
  // private elementTypeProperties: { [elementTypeId: string]: string[] } = {};
  // private elementTypeVarTypes: { [elementTypeId: string]: string[] } = {};

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

  // getPropertyTypeIdsFor(elementTypeId: string): string[] {
  //   console.log("Get properties for: " + elementTypeId);
  //   const properties = this.elementTypeProperties[elementTypeId];
  //   console.log("Got properties: " + properties);
  //   return properties;
  // }

  // getDefaultPropertyForPropertTypeId(propertyTypeId: string): any {
  //   const elementProperty = this.elementPropertyTypes.filter(
  //     elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];
  //   if (elementProperty) {
  //     return elementProperty.defaultValue;
  //   }
  //   else {
  //     console.log("%c" + "No Default found for " + propertyTypeId, "color: red");
  //     return "";
  //   }
  // }

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

  // makeProperties(elementTypeId: string,propertiesToAdd: string[],self: ModelElementDataService)
  //   : { [propertyTypeId: string]: any } {

  //   console.log("Make Properties For:" + elementTypeId);
  //   var properties: { [propertyTypeId: string]: any } = {};

  //   propertiesToAdd.forEach(function (propertyTypeId: string) {
  //     console.log("looking for property " + propertyTypeId)
  //     properties[propertyTypeId] = self.modelElementDefService.getDefaultPropertyForPropertTypeId(propertyTypeId);
  //   })
  //   return properties;
  // }

  // propertyIsVisible(propertyTypeId: string) {
  //   console.log("get visible status for property:" + propertyTypeId);
  //   const propertyType = this.elementPropertyTypes.filter(property => property.propertyTypeId === propertyTypeId)[0];
  //   return propertyType.visible;
  // }  
  
  //===DATA===

  addElement(elementId: string, elementTypeId: string, properties: ElementProperties) {
    this.modelElements.push({
      elementId: elementId,
      elementTypeId: elementTypeId,
      properties: properties,
      visible: true
    });
  }

  // makeProperties(elementTypeId: string,propertiesToAdd: string[],self: ModelElementDataService)
  //   : { [propertyTypeId: string]: any } {

  //   console.log("Make Properties For:" + elementTypeId);
  //   var properties: { [propertyTypeId: string]: any } = {};

  //   propertiesToAdd.forEach(function (propertyTypeId: string) {
  //     console.log("looking for property " + propertyTypeId)
  //     properties[propertyTypeId] = self.modelElementDefService.getDefaultPropertyForPropertTypeId(propertyTypeId);
  //   })
  //   return properties;
  // }

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
