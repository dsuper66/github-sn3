export interface ModelElement {
    elementId: string;
    elementTypeId: string;
    // bus1: string;
    // bus2: string;
    // properties: ElementProperties;
    // properties: Map<string, any>;
    
    properties: ElementProperties; 
    // properties: {[propertyTypeId:string] : any};
    
    // properties: Record<string, any>;
}

//Dictionary
//https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript

export interface ElementProperties {
  [propertyTypeId:string]:any;
}

// export interface ElementProperty {
//   propertyTypeId:string;
//   value:any;
// }


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
    visible: boolean;
  }


  interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
  }