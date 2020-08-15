import { Injectable } from '@angular/core';
import { ModelElement} from './model-element';
import { Shape } from '../views/shape';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor() {

    //Populate the default element types and properties
    this.allElementTypes = ['bus','branch','gen','load'];
    this.propertiesOfElementType = new Map([
      ['bus',['isRefBus']],
      ['branch',['bus1','bus2','resistance','susceptance']],
      ['gen',['bus1','offers']],
      ['load',['bus1','bids']]
    ])
    this.valueTypesOfProperties = new Map([
      ['isRefBus','bool'],
      ['bus1','string'],
      ['bus2','string'],
      ['offers','tupleArray'],
      ['bids','tupleArray']
    ])
    
   }

  private modelElements:ModelElement[]=[];
  private elementNextIndex = new Map<string, bigint>();

  private allElementTypes:String[]=[];
  private propertiesOfElementType = new Map<string, string[]>();
  private valueTypesOfProperties = new Map<string, string>();
  private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display

  private allProperties:String[] = [];


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
