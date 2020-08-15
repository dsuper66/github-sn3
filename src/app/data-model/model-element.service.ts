import { Injectable } from '@angular/core';
import { ModelElement} from './model-element';
import { Shape } from '../views/shape';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor() { }

  private modelElements:ModelElement[]=[];
  private elementNextIndex = new Map<string, bigint>();

  private propertyTypesOfElementType = new Map<string, [string]>();


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
