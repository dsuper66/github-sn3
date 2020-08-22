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
      {propertyTypeId:'bids', primitiveType:'tranches', defaultValue:[100,70]},
      {propertyTypeId:'offers', primitiveType:'tranches', defaultValue:[50,150]}
    )

    this.propertyIdsOfElementType['bus']=['isRefBus'];
    this.propertyIdsOfElementType['branch']=['conn1','conn2','resistance','susceptance'];
    this.propertyIdsOfElementType['gen'] = ['conn1','offers'];
    this.propertyIdsOfElementType['load'] = ['conn1','bids'];
      // {elementTypeId:'bus',propertyTypeIds:['isRefBus']},
      // {elementTypeId:'branch',propertyTypeIds:['conn1','conn2','resistance','susceptance']},
      // {elementTypeId:'gen',propertyTypeIds:['conn1','offers']},
      // {elementTypeId:'load',propertyTypeIds:['conn1','bids']}
      // );
    // this.valueTypesOfProperties = new Map([
    //   ['isRefBus','bool'],
    //   ['conn1','string'],
    //   ['conn2','string'],
    //   ['offers','tupleArray'],
    //   ['bids','tupleArray']
    // ])
   }

  
  private modelElements:ModelElement[]=[];
  private elementNextIndex = new Map<string, bigint>();

  private elementPropertyTypes:ElementPropertyType[] = [];
  private propertyIdsOfElementType: {[id:string]:string[]} = {};

  // private propertiesOfElementType : Map<string, string[]>;
  private valueTypesOfProperties = new Map<string, string>();
  // private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display

  private allProperties:String[] = [];


  getPropertyIdsOfElementType(elementTypeId:string): string[] {
    console.log ("from: " + this.propertyIdsOfElementType);
    // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
    // return elementType.propertyTypeIds;
    return this.propertyIdsOfElementType[elementTypeId];
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

  makePropertiesForElementType(elementTypeId: string):ElementProperties {
    // let thesePropertyTypeIds = this.propertiesOfElementType.filter(
    //   elementType => elementType.elementTypeId === elementTypeId)[0].propertyTypeIds;

    console.log("makePropertiesForElementType of " + elementTypeId);
    let thesePropertyTypeIds = this.propertyIdsOfElementType[elementTypeId];
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
