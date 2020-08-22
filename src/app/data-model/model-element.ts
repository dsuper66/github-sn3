export class ModelElement {
    elementId: string;
    elementTypeId: string;
    // bus1: string;
    // bus2: string;
    properties: ElementProperties;
}

export interface ElementProperties {
  [propertyTypeId:string]:any;
}

export interface ElementType {
    elementTypeId: string;
    propertyTypeIds: string[];
  }

export interface ElementTypeId {
  id: string;
}

export interface PropertyTypeId {
  id: string;
}
export interface ElementPropertyType {
    propertyTypeId: string;
    primitiveType: string;
    defaultValue: any;
  }


  interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
  }