export interface ModelElement {
  elementId: string;
  elementType: string;
  // bus1: string;
  // bus2: string;
  // properties: ElementProperties;
  // properties: Map<string, any>;

  properties: ElementProperties;
  visible: boolean;
  // properties: {[propertyType:string] : any};

  // properties: Record<string, any>;
}

//Dictionary
//https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript

export interface ElementProperties {
  [propertyType: string]: any;
}


export interface PropertyTypeId {
  id: string;
}
export interface ElementPropertyType {
  propertyType: string;
  primitiveType: string;
  visible: boolean;
}



export interface ElementVarType {
  varTypeId: string;
}

interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}