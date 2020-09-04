import { Injectable } from '@angular/core';
import { ModelElement, ElementPropertyType,ElementProperties,ElementType } from './model-element';

@Injectable({
  providedIn: 'root'
})
export class ModelElementDataService {

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

    this.elementTypeProperties['bidTranche'] = ['parentId', 'bidLimit', 'bidPrice'];
    this.elementTypeProperties['genTranche'] = ['parentId', 'genLimit', 'genPrice'];
    this.elementTypeProperties['resTranche'] = ['parentId', 'resLimit', 'resPrice'];
    this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];

  }

  private modelElements: ModelElement[] = [];

  private elementPropertyTypes: ElementPropertyType[] = [];
  private elementTypeProperties: { [id: string]: string[] } = {};

  private elementNextIndex = new Map<string, bigint>();

  getIdForNewElementOfType(elementTypeId: string):string{
        //Get next index for i.d.
        if (this.elementNextIndex[elementTypeId] == undefined) {
          this.elementNextIndex[elementTypeId] = 1;
        }
        let elementIndex = this.elementNextIndex[elementTypeId];
    
        //Make the i.d.
        let newId = elementTypeId + ("000" + elementIndex).slice(-3);
        this.elementNextIndex[elementTypeId] = elementIndex + 1;
        console.log("New Id:" + newId);
        return newId;
  }

  addElement(elementId: string, elementTypeId: string, properties: ElementProperties){
    this.modelElements.push({
      elementId: elementId,
      elementTypeId: elementTypeId,
      properties: properties
    });
  }

  getPropertyTypeIdsFor(elementTypeId: string): string[] {
    console.log("Get properties for: " + elementTypeId);    
    const properties = this.elementTypeProperties[elementTypeId];
    console.log("Got properties: " + properties);
    return properties;
  }

  getChildTypeElementsForElementType(elementTypeId: string): ModelElement[] {
    return this.modelElements.filter(
      element => element.properties['parentTypeId'] === elementTypeId);
  }

  getDefaultPropertyForPropertTypeId(propertyTypeId: string):any{
    const elementProperty = this.elementPropertyTypes.filter(
      elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];
    return elementProperty.defaultValue;
  }

  getModelElements(): ModelElement[] {
    return this.modelElements;
  }

  getModelElementForId(elementId: string): ModelElement | undefined {
    return this.modelElements.filter(element => element.elementId === elementId)[0];
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


  makeProperties(
    elementTypeId: string, 
    propertiesToAdd: string[],
    self: ModelElementDataService
    )
    :{ [propertyTypeId: string]: any } {

    console.log("Make Properties For:" + elementTypeId);
    var properties: { [propertyTypeId: string]: any } = {};

    propertiesToAdd.forEach(function (propertyTypeId: string) {
      console.log("looking for property " + propertyTypeId)
      properties[propertyTypeId] = self.getDefaultPropertyForPropertTypeId(propertyTypeId);
    })
    return properties;
  }

}
