import { Injectable } from '@angular/core';
import { 
  ModelElement
  // ElementPropertyType,
  // ElementProperties,
  // ElementType 
} from './model-element';
import { Shape } from '../views/shape';
import { ModelElementDataService } from './model-element-data.service';
import { ModelElementDefService } from './model-element-def.service';
// import { ElementType } from './model-element'
// import { ElementProperties } from './model-element'

import { BehaviorSubject } from 'rxjs';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor(
    private modelElementDataService: ModelElementDataService,
    private modelElementDefService: ModelElementDefService) 
  { }

  //Add element (for child elements record their parent)
  addModelElement(elementTypeToAdd: string, parentId?:string, childNum?: number): string {

    //Add the new element
    console.log("addModelElement:" + elementTypeToAdd);

    //ID for the new element (child element is from parent)
    const elementIdForNewElement 
      = (parentId && childNum) 
      ? this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd,childNum)
      : this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
    
    //Properties
    const propertyTypeIds = this.modelElementDefService.getPropertyTypeIdsFor(elementTypeToAdd);
    const properties = this.modelElementDefService.makeProperties(
      elementTypeToAdd,propertyTypeIds);
      // propertyTypeIds,
      // this.modelElementDataService);

    //Add the element
    this.modelElementDataService.addElement(
      elementIdForNewElement,
      elementTypeToAdd,
      properties
    )

    //If this is a child then assign parent property
    if (parentId) {
          this.modelElementDataService.setPropertyForElement(elementIdForNewElement,'parentId',parentId);
    }

    //Create any child elements (linked back to parent like a gen is to a bus)
    const self = this;
    const childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeToAdd);
    childElementDefs.forEach(function (childElementDef: ModelElement) {
      const childType = childElementDef.properties['childTypeId'];
      const childCount = childElementDef.properties['childCount'];
      console.log(">>>>>>>>" + childType + " count:" + childCount);
      
      //Add the child record(s)
      for (let childNum = 1; childNum <= childCount; childNum++) {
        self.addModelElement(childType,elementIdForNewElement,childNum);
      }
    });

    //Special case
    //bus... need one (and only one) with isRefBus = true
    if (elementTypeToAdd === 'bus') {
        //If no refBus then make this refBus = true
        if (this.modelElementDataService.getElementsWithPropertyValue('isRefBus','true').length == 0) {
          this.modelElementDataService.setPropertyForElement(elementIdForNewElement,'isRefBus','true');
        }
    }

    return elementIdForNewElement;
  }

}
