import { Injectable } from '@angular/core';
import { ModelElement} from './model-element';

@Injectable({
  providedIn: 'root'
})
export class ModelElementService {

  constructor() { }

  private modelElements:ModelElement[]=[];
  private elementNextIndex = new Map<string, bigint>();

  addModelElement(elementType: string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementType] == undefined) {
      this.elementNextIndex[elementType] = 1;
    }
    let elementIndex = this.elementNextIndex[elementType];
    let elementId = elementType + elementIndex;
    this.elementNextIndex[elementType] = elementIndex + 1;

    this.modelElements.push({
      elementType: elementType,
      elementId: elementId,
      name: elementId
    });
    return elementId;
  }

}
