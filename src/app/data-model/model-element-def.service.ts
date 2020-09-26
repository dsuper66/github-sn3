import { Injectable } from '@angular/core';

import {
  ElementPropertyType, ModelElement,
  // DefaultPropertyValue
} from './model-element';
import { ModelElementDataService } from './model-element-data.service';

export interface DefaultValue {
  propertyType: string;
  elementType: string,
  defaultValue: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModelElementDefService {

  constructor() {


    //Property Types
    this.elementPropertyTypeSettings.push(
      { propertyType: 'isRefBus', primitiveType: 'bool', visible: true },
      { propertyType: 'fromBus', primitiveType: 'string', visible: false },
      { propertyType: 'toBus', primitiveType: 'string', visible: false },
      { propertyType: 'flowMax', primitiveType: 'number', visible: true },
      { propertyType: 'resistance', primitiveType: 'number', visible: true },
      { propertyType: 'susceptance', primitiveType: 'number', visible: true },
      { propertyType: 'childCount', primitiveType: 'number', visible: false },
      { propertyType: 'parentType', primitiveType: 'string', visible: false },
      { propertyType: 'childTypeId', primitiveType: 'string', visible: false },
      { propertyType: 'parentId', primitiveType: 'string', visible: false },
      { propertyType: 'trancheLimit', primitiveType: 'number', visible: true },
      { propertyType: 'tranchePrice', primitiveType: 'number', visible: true },
      { propertyType: 'flowLimit', primitiveType: 'number', visible: true },
      { propertyType: 'lossLimit', primitiveType: 'number', visible: true },
      { propertyType: 'capacityMax', primitiveType: 'number', visible: true },
      { propertyType: 'direction', primitiveType: 'number', visible: true }

    )

    //Separate so that different element types can have different defaults for the same properties
    this.defaultValueSettings.push(
      { propertyType: 'isRefBus', elementType: 'bus', defaultValue: false },
      { propertyType: 'flowMax', elementType: 'branch', defaultValue: 100 },
      { propertyType: 'resistance', elementType: 'branch', defaultValue: 10 },
      { propertyType: 'susceptance', elementType: 'branch', defaultValue: .001 },
      { propertyType: 'trancheLimit', elementType: 'bidTranche', defaultValue: 70 },
      { propertyType: 'tranchePrice', elementType: 'bidTranche', defaultValue: 150 },
      { propertyType: 'trancheLimit', elementType: 'enOfferTranche', defaultValue: 80 },
      { propertyType: 'tranchePrice', elementType: 'enOfferTranche', defaultValue: 100 },
      { propertyType: 'trancheLimit', elementType: 'resOfferTranche', defaultValue: 90 },
      { propertyType: 'tranchePrice', elementType: 'resOfferTranche', defaultValue: 40 },
      { propertyType: 'capacityMax', elementType: 'gen', defaultValue: 120 },
      { propertyType: 'childCount', elementType: 'childDef', defaultValue: 100 }
    )

    //Element Types and Property Types
    //Parent elements
    this.elementTypeProperties['bus'] = ['isRefBus'];
    //Branch (flow limit and losses are at the directional level)
    this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'susceptance', 'resistance','flowMax'];
    this.elementTypeProperties['gen'] = ['toBus', 'capacityMax'];
    this.elementTypeProperties['load'] = ['fromBus'];
    //Element definitions (created in the data service) that define a child to be created 
    this.elementTypeProperties['childDef'] = ['parentType', 'childTypeId', 'childCount'];
    //Child elements - tranches
    this.elementTypeProperties['bidTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
    this.elementTypeProperties['enOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
    this.elementTypeProperties['resOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
    this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
    //Child elements - unrestricted variables
    //Directional branches (power flow is at the parent branch level)
    this.elementTypeProperties['dirBranch'] = ['parentId', 'fromBus', 'toBus', 'direction','susceptance'];
    // this.elementTypeProperties['dirBranchNeg'] = ['parentId', 'fromBus', 'toBus'];



  }


  private elementPropertyTypeSettings: ElementPropertyType[] = [];
  private elementTypeProperties: { [elementType: string]: string[] } = {};
  private defaultValueSettings: DefaultValue[] = [];

  propertyIsVisible(propertyType: string) {
    console.log("get visible status for property:" + propertyType);
    const propertyTypeSettings = this.elementPropertyTypeSettings.filter(property => property.propertyType === propertyType)[0];
    return propertyTypeSettings.visible;
  }

  getDefaultValueForProperty(propertyType: string, elementType: string): any {
    const defaultValueSetting = this.defaultValueSettings.filter(
      defaultValueSetting => defaultValueSetting.propertyType === propertyType
        && defaultValueSetting.elementType == elementType)[0];
    if (defaultValueSetting) {
      console.log("found default:" + defaultValueSetting.defaultValue);
      return defaultValueSetting.defaultValue;
    }
    else {
      console.log("%c" + "No Default found for:" + elementType + " property:" + propertyType, "color: red");
      return "";
    }
  }

  getDefaultSettingsForElementType(elementType: string) {
    return this.defaultValueSettings.filter(
      defaultValueSetting => defaultValueSetting.elementType == elementType)
  }

  // setDefaultValues(element: ModelElement): any {
  //   for (const defaultValueSetting of this.defaultValueSettings.filter(
  //     defaultValueSetting => defaultValueSetting.elementType == element.elementType)) {
        
  //     }
  // }  

  getPropertyTypesFor(elementType: string): string[] {
    console.log("Get properties for: " + elementType);
    const properties = this.elementTypeProperties[elementType];
    console.log("Got properties: " + properties);
    return properties;
  }


  // makeProperties(elementType: string, propertiesToAdd: string[], childNum?: number): { [propertyType: string]: any } {

  //   console.log("Make Properties For:" + elementType + " from propertiesToAdd count:" + propertiesToAdd.length);
  //   var properties: { [propertyType: string]: any } = {};

  //   //Get defaults
  //   for (const propertyType of propertiesToAdd) {
  //     console.log("looking for defaults for property: " + propertyType);
  //     var addDefaults = true;
  //     //If child element, only add defaults to number 1
  //     if (childNum) {
  //       if (childNum != 1) {addDefaults = false}
  //     }
  //     //Add defaults
  //     if (addDefaults) {
  //       console.log("Added " + propertyType)
  //       properties[propertyType] = this.getDefaultValueForProperty(propertyType, elementType);
  //     }
  //   } 

  //   return properties;
  // }


}
