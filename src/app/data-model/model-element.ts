export class ModelElement {
    elementId: string;
    elementType: string;
    bus1: string;
    bus2: string;
}

export interface ElementProperty {
  [propertyTypeId:string]:any;
}

export interface ElementType {
    elementTypeId: string;
    elementPropertyTypes: string[];
  }

export interface ElementPropertyType {
    propertyTypeId: string;
    primitiveType: string;
  }


  interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
  }