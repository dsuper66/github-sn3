import { Injectable } from '@angular/core';

import {
  ElementPropertyType, 
  ModelElement,
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
    //All property types must have an entry here, for the data entry display
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
      { propertyType: 'direction', primitiveType: 'number', visible: true },
      { propertyType: 'islandId', primitiveType: 'string', visible: false },
      { propertyType: 'islandResShortfallPrice', primitiveType: 'number', visible: true },
      { propertyType: 'genResShortfallPrice', primitiveType: 'number', visible: true }
    )

    //Separate so that different element types can have different defaults for the same properties
    this.defaultValueSettings.push(
      { propertyType: 'isRefBus', elementType: 'bus', defaultValue: false },
      { propertyType: 'flowMax', elementType: 'branch', defaultValue: 300 },
      { propertyType: 'resistance', elementType: 'branch', defaultValue: 10 },
      { propertyType: 'susceptance', elementType: 'branch', defaultValue: 1 },
      { propertyType: 'trancheLimit', elementType: 'bidTranche', defaultValue: 100 },
      { propertyType: 'tranchePrice', elementType: 'bidTranche', defaultValue: 1000 },
      { propertyType: 'trancheLimit', elementType: 'enOfferTranche', defaultValue: 250 },
      { propertyType: 'tranchePrice', elementType: 'enOfferTranche', defaultValue: 70 },
      { propertyType: 'trancheLimit', elementType: 'resOfferTranche', defaultValue: 0 },
      { propertyType: 'tranchePrice', elementType: 'resOfferTranche', defaultValue: 40 },
      { propertyType: 'capacityMax', elementType: 'gen', defaultValue: 120 },
      // { propertyType: 'childCount', elementType: 'childDef', defaultValue: 100 },
      { propertyType: 'islandResShortfallPrice', elementType: 'island', defaultValue: 9000 },
      { propertyType: 'genResShortfallPrice', elementType: 'gen', defaultValue: 20000 }
    )

    //Define Element Types and Property Types
    //An Element Type that is included in the model must be defined here to know its properties
    //Parent elements
    this.elementTypeProperties['bus'] = ['isRefBus'];
    //Branch (flow limit and losses are at the directional level)
    this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'susceptance', 'resistance','flowMax'];
    this.elementTypeProperties['gen'] = ['toBus', 'capacityMax','islandId','genResShortfallPrice'];
    this.elementTypeProperties['load'] = ['fromBus'];
    //Element definitions (created in the data service constructor) that define a child to be created 
    //(because the creation is not dynamic, this definition is not actually used)
    this.elementTypeProperties['childDef'] = ['parentType', 'childTypeId', 'childCount'];

    //Child elements - tranches
    //Bid and offer need bus (inherited), so cleared quantities go to bus
    this.elementTypeProperties['bidTranche'] = ['parentId', 'trancheLimit', 'tranchePrice','fromBus'];
    this.elementTypeProperties['enOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice','toBus'];
    //Reserve needs islandId (inherited), so cleared quantities go to island
    this.elementTypeProperties['resOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice','islandId'];
    this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];

    //Child elements - unrestricted variables
    //Directional branches (power flow is at the parent branch level)
    this.elementTypeProperties['dirBranch'] = ['parentId', 'fromBus', 'toBus', 'direction','susceptance'];

    //Static elements
    this.elementTypeProperties['mathModel'] = [];
    this.elementTypeProperties['island'] = ['islandResShortfallPrice'];
  }


  private elementPropertyTypeSettings: ElementPropertyType[] = [];
  private elementTypeProperties: { [elementType: string]: string[] } = {};
  private defaultValueSettings: DefaultValue[] = [];

  elementHasProperty(element: ModelElement, propertyType: string) {
    const properties = this.elementTypeProperties[element.elementType];
    return (properties.filter( 
      property => property == propertyType)[0] != undefined);
  }

  propertyIsVisible(propertyType: string) {
    console.log("get visible status for property:" + propertyType);
    const propertyTypeSettings = this.elementPropertyTypeSettings.filter(property => property.propertyType === propertyType)[0];
    return propertyTypeSettings.visible;
  }

  /*
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
  }*/

  getDefaultSettingsAll(){
    return this.defaultValueSettings;
  }

  getDefaultSettingsForElementType(elementType: string) {
    return this.defaultValueSettings.filter(
      defaultValueSetting => defaultValueSetting.elementType == elementType)
  } 

  setDefaultValue(elementType: string, propertType: string, value: number) {
    const defaultSetting = this.defaultValueSettings.find(
      defaultValueSetting => 
        defaultValueSetting.elementType == elementType
        && defaultValueSetting.propertyType == propertType)
    if (defaultSetting) {
      defaultSetting.defaultValue = value;
    }
  } 

  getPropertyTypesFor(elementType: string): string[] {
    console.log("Get properties for: " + elementType);
    const properties = this.elementTypeProperties[elementType];
    console.log("Got properties: " + properties);
    return properties;
  }

  elementTypeHasPropertyType(elementType:string, propertyType: string):boolean{
    const propertyTypes = this.elementTypeProperties[elementType];
    if (propertyTypes) {
      if (propertyTypes.find(pt => pt === propertyType)){
        return true;
      }
    }
    return false;
  }

  getPropertyCount(elementType: string): number {
    const propertyTypes = this.elementTypeProperties[elementType];
    if (propertyTypes != undefined) {
      return propertyTypes.length;
    }
    else {
      return 0;
    }
  }



}
