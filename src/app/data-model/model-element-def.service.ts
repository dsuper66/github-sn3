import { Injectable } from '@angular/core';

import {
  ElementPropertyType,
  // DefaultPropertyValue
} from './model-element';

export interface DefaultValue {
  propertyTypeId: string;
  elementType: string,
  defaultValue: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModelElementDefService {

  constructor() {


    //Property Types
    this.elementPropertyTypes.push(
      { propertyTypeId: 'isRefBus', primitiveType: 'bool', visible: true },
      { propertyTypeId: 'fromBus', primitiveType: 'string', visible: false },
      { propertyTypeId: 'toBus', primitiveType: 'string', visible: false },
      { propertyTypeId: 'flowMax', primitiveType: 'number', visible: true },
      { propertyTypeId: 'resistance', primitiveType: 'number', visible: true },
      { propertyTypeId: 'susceptance', primitiveType: 'number', visible: true },
      { propertyTypeId: 'childCount', primitiveType: 'number', visible: false },
      { propertyTypeId: 'parentTypeId', primitiveType: 'string', visible: false },
      { propertyTypeId: 'childTypeId', primitiveType: 'string', visible: false },
      { propertyTypeId: 'parentId', primitiveType: 'string', visible: false },
      { propertyTypeId: 'trancheLimit', primitiveType: 'number', visible: true },
      { propertyTypeId: 'tranchePrice', primitiveType: 'number', visible: true },
      { propertyTypeId: 'flowLimit', primitiveType: 'number', visible: true },
      { propertyTypeId: 'lossLimit', primitiveType: 'number', visible: true },
      { propertyTypeId: 'capacityMax', primitiveType: 'number', visible: true }

    )

    this.defaultValueSettings.push(
      { propertyTypeId: 'isRefBus', elementType: 'bus', defaultValue: false },
      { propertyTypeId: 'flowMax', elementType: 'branch', defaultValue: 100 },
      { propertyTypeId: 'resistance', elementType: 'branch', defaultValue: 10 },
      { propertyTypeId: 'susceptance', elementType: 'branch', defaultValue: .001 },
      { propertyTypeId: 'trancheLimit', elementType: 'bidTranche', defaultValue: 70 },
      { propertyTypeId: 'tranchePrice', elementType: 'bidTranche', defaultValue: 150 },
      { propertyTypeId: 'trancheLimit', elementType: 'enOfferTranche', defaultValue: 80 },
      { propertyTypeId: 'tranchePrice', elementType: 'enOfferTranche', defaultValue: 100 },
      { propertyTypeId: 'trancheLimit', elementType: 'resOfferTranche', defaultValue: 90 },
      { propertyTypeId: 'tranchePrice', elementType: 'resOfferTranche', defaultValue: 40 },
      { propertyTypeId: 'capacityMax', elementType: 'gen', defaultValue: 120 },
      { propertyTypeId: 'childCount', elementType: 'childDef', defaultValue: 100 }
    )

    //Element Types and Property Types
    //Parent elements
    this.elementTypeProperties['bus'] = ['isRefBus'];
    this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'flowMax', 'susceptance'];
    this.elementTypeProperties['gen'] = ['toBus', 'capacityMax'];
    this.elementTypeProperties['load'] = ['fromBus'];
    //Element that defines a child
    this.elementTypeProperties['childDef'] = ['parentTypeId', 'childTypeId', 'childCount'];
    //Child elements - tranches
    this.elementTypeProperties['bidTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
    this.elementTypeProperties['enOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
    this.elementTypeProperties['resOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
    this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
    //Child elements - unrestricted variables
    // this.elementTypeProperties['posFlow'] = ['parentId'];
    // this.elementTypeProperties['negFlow'] = ['parentId'];    
    // this.elementTypeProperties['dirAnglePos'] = ['parentId'];
    // this.elementTypeProperties['dirAngleNeg'] = ['parentId'];
    this.elementTypeProperties['dirBranchPos'] = ['fromBus', 'toBus', 'flowMax', 'susceptance'];
    this.elementTypeProperties['dirBranchNeg'] = ['fromBus', 'toBus', 'flowMax', 'susceptance'];



  }


  private elementPropertyTypes: ElementPropertyType[] = [];
  private elementTypeProperties: { [elementType: string]: string[] } = {};
  private defaultValueSettings: DefaultValue[] = [];

  propertyIsVisible(propertyTypeId: string) {
    console.log("get visible status for property:" + propertyTypeId);
    const propertyType = this.elementPropertyTypes.filter(property => property.propertyTypeId === propertyTypeId)[0];
    return propertyType.visible;
  }

  getDefaultValueForProperty(propertyTypeId: string, elementType: string): any {
    const defaultValueSetting = this.defaultValueSettings.filter(
      defaultValueSetting => defaultValueSetting.propertyTypeId === propertyTypeId
        && defaultValueSetting.elementType == elementType)[0];
    if (defaultValueSetting) {
      console.log("found default:" + defaultValueSetting.defaultValue);
      return defaultValueSetting.defaultValue;
    }
    else {
      console.log("%c" + "No Default found for:" + elementType + " property:" + propertyTypeId, "color: red");
      return "";
    }
  }

  getPropertyTypeIdsFor(elementType: string): string[] {
    console.log("Get properties for: " + elementType);
    const properties = this.elementTypeProperties[elementType];
    console.log("Got properties: " + properties);
    return properties;
  }

  makeProperties(elementType: string, propertiesToAdd: string[], childNum?: number): { [propertyTypeId: string]: any } {

    console.log("Make Properties For:" + elementType + " from propertiesToAdd count:" + propertiesToAdd.length);
    var properties: { [propertyTypeId: string]: any } = {};

    //Get defaults
    for (const propertyTypeId of propertiesToAdd) {
      console.log("looking for defaults for property: " + propertyTypeId);
      var addDefaults = true;
      //If child element, only add defaults to number 1
      if (childNum) {
        if (childNum != 1) {addDefaults = false}
      }
      //Add defaults
      if (addDefaults) {
        properties[propertyTypeId] = this.getDefaultValueForProperty(propertyTypeId, elementType);
      }
    }
    return properties;
  }

}
