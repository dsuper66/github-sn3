import { Injectable } from '@angular/core';

import { 
  ElementPropertyType, 
  // DefaultPropertyValue
} from './model-element';

@Injectable({
  providedIn: 'root'
})
export class ModelElementDefService {

  constructor() { 


    //Property Types
    this.elementPropertyTypes.push(
      { propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: 'false', visible: true },
      { propertyTypeId: 'fromBus', primitiveType: 'string', defaultValue: 'none', visible: false },
      { propertyTypeId: 'toBus', primitiveType: 'string', defaultValue: 'none', visible: false },
      { propertyTypeId: 'flowMax', primitiveType: 'number', defaultValue: '100', visible: true },
      { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10', visible: true },
      { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001', visible: true },
      { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3', visible: false },
      { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none', visible: false },
      { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none', visible: false },
      { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none', visible: false },
      { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80', visible: true },
      { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100', visible: true },
      { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90', visible: true },
      { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10', visible: true },
      { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70', visible: true },
      { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150', visible: true },
      { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25', visible: true },
      { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2', visible: true },
      { propertyTypeId: 'capacityMax', primitiveType: 'number', defaultValue: '100', visible: true }

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
    this.elementTypeProperties['bidTranche'] = ['parentId', 'bidLimit', 'bidPrice'];
    this.elementTypeProperties['enOfferTranche'] = ['parentId', 'genLimit', 'genPrice'];
    this.elementTypeProperties['resTranche'] = ['parentId', 'resLimit', 'resPrice'];
    this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
    //Child elements - unrestricted variables
    this.elementTypeProperties['posFlow'] = ['parentId'];
    this.elementTypeProperties['negFlow'] = ['parentId'];    
    this.elementTypeProperties['posAngle'] = ['parentId'];
    this.elementTypeProperties['negAngle'] = ['parentId'];

  }

  private elementPropertyTypes: ElementPropertyType[] = [];
  private elementTypeProperties: { [elementType: string]: string[] } = {};
  // private defaultPropertyValues: DefaultPropertyValue[] = [];

  propertyIsVisible(propertyTypeId: string) {
    console.log("get visible status for property:" + propertyTypeId);
    const propertyType = this.elementPropertyTypes.filter(property => property.propertyTypeId === propertyTypeId)[0];
    return propertyType.visible;
  } 

  getDefaultPropertyForPropertTypeId(propertyTypeId: string): any {
    const elementProperty = this.elementPropertyTypes.filter(
      elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];
    if (elementProperty) {
      return elementProperty.defaultValue;
    }
    else {
      console.log("%c" + "No Default found for:" + propertyTypeId, "color: red");
      return "";
    }
  }

  getPropertyTypeIdsFor(elementType: string): string[] {
    console.log("Get properties for: " + elementType);
    const properties = this.elementTypeProperties[elementType];
    console.log("Got properties: " + properties);
    return properties;
  }

  makeProperties(elementType: string,propertiesToAdd: string[]) : { [propertyTypeId: string]: any } {

    console.log("Make Properties For:" + elementType + " from propertiesToAdd count:" + propertiesToAdd.length);
    var properties: { [propertyTypeId: string]: any } = {};

    for (const propertyTypeId of propertiesToAdd) {
      console.log("looking for property: " + propertyTypeId);
      properties[propertyTypeId] = this.getDefaultPropertyForPropertTypeId(propertyTypeId);
    }
    return properties;
  }

}
