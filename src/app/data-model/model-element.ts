export class ModelElement {
    elementId: string;
    elementType: string;
    bus1: string;
    bus2: string;
}



export interface ElementType {
    elementTypeId: string;
    properties: string[];
  }

export interface ElementProperty {
    elementPropertyId: string;
    primitiveType: string;
  }