import { Injectable } from '@angular/core';
import { ModelElement, ElementPropertyType } from './model-element';
import { Shape } from '../views/shape';
import { ElementType } from './model-element'
import { ElementProperties } from './model-element'

import { BehaviorSubject } from 'rxjs';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor() {

    //Property Types (and Defaults)
    this.elementPropertyTypes.push(
      { propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: true },
      { propertyTypeId: 'connId1', primitiveType: 'string', defaultValue: 'none' },
      { propertyTypeId: 'connId2', primitiveType: 'string', defaultValue: 'none' },
      { propertyTypeId: 'maxFlow', primitiveType: 'number', defaultValue: '100' },
      { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10' },
      { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001' },
      { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3' },
      { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none' },
      { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none' },
      { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none' },
      { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80' },
      { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100' },
      { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90' },
      { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10' },
      { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70' },
      { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150' },
      { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25' },
      { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2' },
      { propertyTypeId: 'maxGen', primitiveType: 'number', defaultValue: '100' }
    )

    //Add static elements, accessed via the Settings display
    // var elementProperties: ElementProperties = {};
    // elementProperties['parentTypeId'] = 'load';
    // elementProperties['childTypeId'] = 'bidTranche'
    // elementProperties['childCount'] = '3'
    this.modelElements.push({
      elementId: 'bidTrancheDef', elementTypeId: 'childSet',
      properties: this.makeDict([
        { 'parentTypeId': 'load' }, {'childTypeId': 'bidTranche' }, {'childCount': '3'}])
    });
    this.modelElements.push({
      elementId: 'genTrancheDef', elementTypeId: 'childSet',
      properties: this.makeDict([
        { 'parentTypeId': 'gen' }, {'childTypeId': 'genTranche' }, {'childCount': '3'}])
    });
    this.modelElements.push({
      elementId: 'resTrancheDef', elementTypeId: 'childSet',
      properties: this.makeDict([
        { 'parentTypeId': 'gen' }, {'childTypeId': 'resTranche' }, {'childCount': '3'}])
    });     


    //Element Types and their Property Type Ids
    this.elementTypeProperties['bus'] = ['isRefBus'];
    this.elementTypeProperties['branch'] = ['connId1', 'connId2', 'maxFlow', 'susceptance'];
    this.elementTypeProperties['gen'] = ['connId1', 'maxGen'];
    this.elementTypeProperties['load'] = ['connId1'];

    this.elementTypeProperties['childSet'] = ['parentTypeId', 'childTypeId', 'childCount'];

    this.elementTypeProperties['bidTranch'] = ['parentId', 'bidLimit', 'bidPrice'];
    this.elementTypeProperties['genTranch'] = ['parentId', 'genLimit', 'genPrice'];
    this.elementTypeProperties['resTranch'] = ['parentId', 'resLimit', 'resPrice'];
    this.elementTypeProperties['lossTranch'] = ['parentId', 'flowLimit', 'lossLimit'];

  }

  private modelElements: ModelElement[] = [];

  private elementPropertyTypes: ElementPropertyType[] = [];
  private elementTypeProperties: { [id: string]: string[] } = {};

  // private valueTypesOfProperties = new Map<string, string>();
  // private allProperties:String[] = [];

  private elementNextIndex = new Map<string, bigint>();

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

  getPropertyTypeIdsOfElementType(elementTypeId: string): string[] {
    console.log("from: " + this.elementTypeProperties);
    // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
    // return elementType.propertyTypeIds;
    return this.elementTypeProperties[elementTypeId];
  }

  getModelElements(): ModelElement[] {
    return this.modelElements;
  }

  getModelElementForId(elementId: string): ModelElement | undefined {
    return this.modelElements.filter(element => element.elementId === elementId)[0];
  }

  //Add element (for child elements record their parent)
  addModelElement(elementTypeIdForNewElement: string, parentId?:string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementTypeIdForNewElement] == undefined) {
      this.elementNextIndex[elementTypeIdForNewElement] = 1;
    }
    let elementIndex = this.elementNextIndex[elementTypeIdForNewElement];

    //Make the i.d.
    let elementIdForNewElement = elementTypeIdForNewElement + ("000" + elementIndex).slice(-3);
    this.elementNextIndex[elementTypeIdForNewElement] = elementIndex + 1;

    //Add the element
    console.log("Adding:" + elementIdForNewElement);
    this.modelElements.push({
      elementId: elementIdForNewElement,
      elementTypeId: elementTypeIdForNewElement,
      properties: this.makePropertiesForElementType(elementTypeIdForNewElement)
      // bus1: "",
      // bus2: ""
    });

    //Add any child elements associated with this element type
    //Get any childTypes where parenet type matches the element we are adding
    const childTypesForElementType = this.modelElements.filter(
      element => element.properties['parentTypeId'] === elementTypeIdForNewElement);

    //Create any child elements (linked back like a gen is to a bus)
    childTypesForElementType.forEach(function (childElement: ModelElement) {
      const childTypeId = childElement.properties['childTypeId'];
      console.log(">>>>>>>>" + childTypeId);
      
      () => this.addModelElement(childTypeId,elementTypeIdForNewElement);
    });


    return elementIdForNewElement;
  }

  getValueForElementProperty(elementId: string, propertyTypeId: string): string {
    let properties = this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties;
    return properties[propertyTypeId];
  }

  setValueForElementProperty(elementId: string, propertyTypeId: string, value: any) {
    this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties[propertyTypeId] = value;
  }

  makePropertiesForElementType(elementTypeId: string): { [propertyTypeId: string]: any } {
    // let thesePropertyTypeIds = this.propertiesOfElementType.filter(
    //   elementType => elementType.elementTypeId === elementTypeId)[0].propertyTypeIds;

    console.log("makePropertiesForElementType of " + elementTypeId);
    let thesePropertyTypeIds = this.elementTypeProperties[elementTypeId];
    console.log("got property types: " + thesePropertyTypeIds);
    // let properties = this.elementPropertyTypes.filter(
    //   elementPropertyType => thesePropertyTypeIds.find(elementPropertyType.propertyTypeId thesePropertyTypeIds)
    // )
    var properties: { [propertyTypeId: string]: any } = {};
    for (let propertyTypeId of thesePropertyTypeIds) {

      console.log("looking for property " + propertyTypeId)
      let elementProperty = this.elementPropertyTypes.filter(
        elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];

      //Assign default
      properties[elementProperty.propertyTypeId] = elementProperty.defaultValue;


    }
    return properties;
  }

  // getNewElementId(elementId: string) {
  //   return this.modelElements.filter(modelElement => modelElement.elementId === elementId)[0].name;
  // }

}
