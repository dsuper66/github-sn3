import { Injectable } from '@angular/core';
import { ModelElement} from './model-element';
import { Shape } from '../views/shape';
import {ElementType} from './model-element'
import { BehaviorSubject } from 'rxjs';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor() {
    
    this.elementTypes.push(
      {elementTypeId:'bus',properties:['isRefBus']},
      {elementTypeId:'branch',properties:['conn1','conn2','resistance','susceptance']},
      {elementTypeId:'gen',properties:['conn1','offers']},
      {elementTypeId:'load',properties:['conn1','bids']}
      );
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

  private elementTypes:ElementType[] = [];

  private propertiesOfElementType : Map<string, string[]>;
  private valueTypesOfProperties = new Map<string, string>();
  // private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display

  private allProperties:String[] = [];


  getPropertiesOfElementType(elementTypeId:string):string[] {
    console.log ("from: " + this.propertiesOfElementType);
    let elementType = this.elementTypes.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
    return elementType.properties;
  }

  addModelElement(elementType: string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementType] == undefined) {
      this.elementNextIndex[elementType] = 1;
    }
    let elementIndex = this.elementNextIndex[elementType];

    //Make the i.d.
    let elementId = elementType +  ("000" + elementIndex).slice(-3);
    this.elementNextIndex[elementType] = elementIndex + 1;

    //Add the element
    this.modelElements.push({
      elementId: elementId,
      elementType: elementType,
      bus1: "",
      bus2: ""
    });

    return elementId;
  }


  // getNewElementId(elementId: string) {
  //   return this.modelElements.filter(modelElement => modelElement.elementId === elementId)[0].name;
  // }

}
