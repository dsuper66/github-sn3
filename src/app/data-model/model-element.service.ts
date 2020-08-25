import { Injectable } from '@angular/core';
import { ModelElement, ElementPropertyType} from './model-element';
import { Shape } from '../views/shape';
import {ElementType} from './model-element'
import {ElementProperties} from './model-element'

import { BehaviorSubject } from 'rxjs';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor() {
    
    this.elementPropertyTypes.push(
      {propertyTypeId:'isRefBus', primitiveType:'bool', defaultValue:true},
      {propertyTypeId:'conn1', primitiveType:'string', defaultValue:'none'},
      {propertyTypeId:'conn2', primitiveType:'string', defaultValue:'none'},
      {propertyTypeId:'resistance', primitiveType:'number', defaultValue:'10'},
      {propertyTypeId:'susceptance', primitiveType:'number', defaultValue:'0.001'},
      {propertyTypeId:'enBids', primitiveType:'tranches', defaultValue:[100,70]},
      {propertyTypeId:'enOffers', primitiveType:'tranches', defaultValue:[50,150]},
      {propertyTypeId:'resOffers', primitiveType:'tranches', defaultValue:[50,150]},
      {propertyTypeId:'genCapacity', primitiveType:'number', defaultValue:'100'}
    )

    this.propertyTypeIdsOfElementType['bus']=['isRefBus'];
    this.propertyTypeIdsOfElementType['branch']=['conn1','conn2','resistance','susceptance'];
    this.propertyTypeIdsOfElementType['gen'] = ['conn1','enOffers','resOffers','genCapacity'];
    this.propertyTypeIdsOfElementType['load'] = ['conn1','enBids'];

   }

  
  private modelElements:ModelElement[]=[];
  private elementNextIndex = new Map<string, bigint>();

  private elementPropertyTypes:ElementPropertyType[] = [];
  private propertyTypeIdsOfElementType: {[id:string]:string[]} = {};

  // private propertiesOfElementType : Map<string, string[]>;
  private valueTypesOfProperties = new Map<string, string>();
  // private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display

  private allProperties:String[] = [];


  getPropertyTypeIdsOfElementType(elementTypeId:string): string[] {
    console.log ("from: " + this.propertyTypeIdsOfElementType);
    // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
    // return elementType.propertyTypeIds;
    return this.propertyTypeIdsOfElementType[elementTypeId];
  }

  getModelElements(): ModelElement[] {
    return this.modelElements;
  }

  addModelElement(elementTypeId: string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementTypeId] == undefined) {
      this.elementNextIndex[elementTypeId] = 1;
    }
    let elementIndex = this.elementNextIndex[elementTypeId];

    //Make the i.d.
    let elementId = elementTypeId +  ("000" + elementIndex).slice(-3);
    this.elementNextIndex[elementTypeId] = elementIndex + 1;

    //Add the element
    this.modelElements.push({
      elementId: elementId,
      elementTypeId: elementTypeId,
      properties: this.makePropertiesForElementType(elementTypeId)
      // bus1: "",
      // bus2: ""
    });

    return elementId;
  }

  getValueForElementProperty(elementId:string, propertyTypeId: string):string {
    let properties = this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties;
    return properties[propertyTypeId];
  }

  setValueForElementProperty(elementId:string, propertyTypeId: string, value:any){
    this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties[propertyTypeId] = value;
  }

  makePropertiesForElementType(elementTypeId: string):ElementProperties {
    // let thesePropertyTypeIds = this.propertiesOfElementType.filter(
    //   elementType => elementType.elementTypeId === elementTypeId)[0].propertyTypeIds;

    console.log("makePropertiesForElementType of " + elementTypeId);
    let thesePropertyTypeIds = this.propertyTypeIdsOfElementType[elementTypeId];
    console.log("got property types: " + thesePropertyTypeIds);
    // let properties = this.elementPropertyTypes.filter(
    //   elementPropertyType => thesePropertyTypeIds.find(elementPropertyType.propertyTypeId thesePropertyTypeIds)
    // )
    var properties:ElementProperties = {};
    for (let propertyTypeId of thesePropertyTypeIds) {

      console.log("looking for " + propertyTypeId)
      let elementProperty = this.elementPropertyTypes.filter(
        elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];

      properties[elementProperty.propertyTypeId] = elementProperty.defaultValue;
      
    }
    return properties;
  }

  // getNewElementId(elementId: string) {
  //   return this.modelElements.filter(modelElement => modelElement.elementId === elementId)[0].name;
  // }

}
