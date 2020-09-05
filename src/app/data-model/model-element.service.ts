import { Injectable } from '@angular/core';
import { ModelElement, ElementPropertyType,ElementProperties,ElementType } from './model-element';
import { Shape } from '../views/shape';
import { ModelElementDataService } from './model-element-data.service';
// import { ElementType } from './model-element'
// import { ElementProperties } from './model-element'

import { BehaviorSubject } from 'rxjs';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor(
    private modelElementDataService: ModelElementDataService) {
    
  }

  //Add element (for child elements record their parent)
  addModelElement(elementTypeIdToAdd: string, parentId?:string): string {

    //Add the new element
    console.log("Add:" + elementTypeIdToAdd);
    const elementIdForNewElement = this.modelElementDataService.getIdForNewElementOfType(elementTypeIdToAdd);
    const propertyTypeIds = this.modelElementDataService.getPropertyTypeIdsFor(elementTypeIdToAdd);

    const properties = this.modelElementDataService.makeProperties(
      elementTypeIdToAdd,
      propertyTypeIds,
      this.modelElementDataService);

    this.modelElementDataService.addElement(
      elementIdForNewElement,
      elementTypeIdToAdd,
      properties
    )

    //If this is a child then a parent Id will have been provided
    if (parentId) {
          //Set the parent property
          this.modelElementDataService.setValueForElementProperty(elementIdForNewElement,'parentId',parentId);
    }

    //Create any child elements (linked back like a gen is to a bus)
    const self = this;
    const childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeIdToAdd);
    childElementDefs.forEach(function (childElementDef: ModelElement) {
      const childTypeId = childElementDef.properties['childTypeId'];
      const childCount = childElementDef.properties['childCount'];
      console.log(">>>>>>>>" + childTypeId + " count:" + childCount);
      
      //Add the child record(s)
      for (let childNum = 1; childNum <= childCount; childNum++) {
        self.addModelElement(childTypeId,elementIdForNewElement);
      }
    });


    return elementIdForNewElement;
  }

}
