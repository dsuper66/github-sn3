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

  iff(condition: boolean, resultTrue: string, resultFalse: string) : string {
    if (condition) {
      return resultTrue;
    }
    else {
      return resultFalse;
    }
  }
  constructor(
    private modelElementDataService: ModelElementDataService,
    private modelElementDefService: ModelElementDefService) { }

  //Add element (for child elements record their parent)
  addModelElement(elementTypeToAdd: string, parentId?: string, childNum?: number): string {

    //Add the new element
    console.log("addModelElement:" + elementTypeToAdd);

    //ID for the new element 
    // const newId
    //   = (parentId && childNum) //child id incorporated parent id
    //     ? this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum)
    //     : this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
    var newId: string;
    if (parentId && childNum) {
      //Special Case for directional branches
      if (elementTypeToAdd == 'dirBranch') {
        if (childNum == 1) {
          newId = parentId + elementTypeToAdd + "Pos"
        }
        else {
          newId = parentId + elementTypeToAdd + "Neg"
        }
      }
      else {//child id is parent + child
        newId = this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum);
      }
    }
    else { //parent
      newId = this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
    }
     
    //Properties
    //const propertyTypeIds = this.modelElementDefService.getPropertyTypesFor(elementTypeToAdd);
    //const properties = this.modelElementDefService.makeProperties(elementTypeToAdd, propertyTypeIds, childNum);

    //Add the element
    this.modelElementDataService.addElement(
      newId,
      elementTypeToAdd,
      {} //properties... empty and then populated either by defaults or data input
    )

    //If this is a child then assign parent property
    if (parentId) {
      this.modelElementDataService.setPropertyForElement(newId, 'parentId', parentId);
    }

    //Special case
    //dirBranch needs a direction property
    if (elementTypeToAdd === 'dirBranch' && childNum != undefined) {
      this.modelElementDataService.setPropertyForElement(
        newId, 'direction', childNum == 1 ? 1 : -1);
    }  

    //Create any child elements (linked back to parent like a gen is to a bus)
    const self = this;
    const childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeToAdd);
    childElementDefs.forEach(function (childElementDef: ModelElement) {
      const childType = childElementDef.properties['childTypeId'];
      const childCount = childElementDef.properties['childCount'];
      console.log("Add Child Elements >>>>>>>>" + childType + " count:" + childCount);

      //Add the child record(s)
      for (let childNum = 1; childNum <= childCount; childNum++) {
        self.addModelElement(childType, newId, childNum);
      }
    });

    //Special case
    //bus... need one (and only one) with isRefBus = true
    if (elementTypeToAdd === 'bus') {
      //If no refBus then make this refBus = true
      if (this.modelElementDataService.getElementsWithPropertyValue('isRefBus', 'true').length == 0) {
        this.modelElementDataService.setPropertyForElement(newId, 'isRefBus', 'true');
      }
    } 

    //Set default values
    for (const defaultValueSetting of 
      this.modelElementDefService.getDefaultSettingsForElementType(elementTypeToAdd)) {
        
      var addDefaults = true;
      //If child element, only add defaults to number 1
      if (childNum) {
        if (childNum != 1) {addDefaults = false}
      }
      //Add defaults
      if (addDefaults) {
        this.modelElementDataService.setPropertyForElement(
          newId,defaultValueSetting.propertyType,defaultValueSetting.defaultValue);
      }
    }

    return newId;
  }

}
