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

  iff(condition: boolean, resultTrue: string, resultFalse: string): string {
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
    console.log(">>>>>addModelElement:" + elementTypeToAdd);

    //ID for the new element 
    // const newId
    //   = (parentId && childNum) //child id incorporated parent id
    //     ? this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum)
    //     : this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
    var newId: string;
    if (parentId && childNum) { //child element
      //Special Case
      //dirBranch child id has a suffix name not number
      if (elementTypeToAdd == 'dirBranch') {
        newId = parentId + elementTypeToAdd + (childNum == 1 ? "Pos" : "Neg");
        // if (childNum == 1) {
        //   newId = parentId + elementTypeToAdd + "Pos"
        // }
        // else {
        //   newId = parentId + elementTypeToAdd + "Neg"
        // }
      }
      else {//child id is parent + child
        newId = this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum);
      }
    }
    else { //parent element
      newId = this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
    }

    //Add the element
    this.modelElementDataService.addElement(
      newId,
      elementTypeToAdd,
      {} //properties... empty and then populated either by defaults or data input
    )

    //If this is a child then assign parent property
    if (parentId) {
      console.log("assign parent property for child")
      this.modelElementDataService.setPropertyForElement(newId, 'parentId', parentId);
    }

    //Special Case
    //dirBranch needs a direction property (which is a multiplier)
    if (elementTypeToAdd === 'dirBranch' && childNum != undefined) {
      this.modelElementDataService.setPropertyForElement(
        newId, 'direction', childNum == 1 ? 1 : -1);
    }

    //Special case
    //gen (and maybe others)... need an island 
    //(when we created the shape we made sure that we had an island, for now there is only one)
    if (this.modelElementDefService.elementTypeHasPropertyType(elementTypeToAdd, 'islandId')) {
      const island = this.modelElementDataService.getModelElementOfType('island')[0];
      if (island) {
        console.log("###Island id:" + island.elementId);
        this.modelElementDataService.setPropertyForElement(newId, 'islandId', island.elementId);
      }
    }

    //Create any child elements (linked back to parent like a gen is to a bus)
    const self = this;
    const childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeToAdd);
    childElementDefs.forEach(function (childElementDef: ModelElement) {
      const childType = childElementDef.properties['childType'];
      const childCount = childElementDef.properties['childCount'];
      console.log("Add Child Elements >>>>>>>>" + childType + " count:" + childCount);

      //Add the child record(s)
      for (let childNum = 1; childNum <= childCount; childNum++) {
        self.addModelElement(childType, newId, childNum);
      }
    });

    //Set default values... this needs to be after the child elements are added so they also get the values
    console.log("set defaults");
    for (const defaultValueSetting of
      this.modelElementDefService.getDefaultSettingsForElementType(elementTypeToAdd)) {

      var addDefaults = true;
      //If child element, only add defaults to number 1, i.e., don't repeat for all
      if (childNum) {
        if (childNum != 1) { addDefaults = false }
      }
      //Add defaults
      if (addDefaults) {
        this.modelElementDataService.setPropertyForElement(
          newId, defaultValueSetting.propertyType, defaultValueSetting.defaultValue);
      }
    }
    console.log("done set defaults");

    //Special case
    //bus... need one (and only one) with isRefBus = true
    //.. needs to be after defaults are applied, because if default is after then it will set all to false
    //###Currently REFBUS is not used###
    /*
    if (elementTypeToAdd === 'bus') {
      //If no refBus then make this refBus = true
      if (this.modelElementDataService.getElementsWherePropertyValue('isRefBus', 'true').length == 0) {
        console.log("set ref bus true for:" + newId);
        this.modelElementDataService.setPropertyForElement(newId, 'isRefBus', 'true');
      }
    }*/

    return newId;
  }

}
