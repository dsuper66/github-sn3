export interface ModelElement {
  elementId: string;
  elementType: string;
  properties: ElementProperties;
  includeInModel: boolean;

  //Results  
  results?: {[resultType:string] : number}; //resultType is varType (quantity) or constraintType (shadow price)
  constraintString?: string; //all the constraints for this element
}

//Dictionary
//https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript

export interface ElementProperties {
  [propertyType: string]: any;
}

// export interface ElementPrices {
//   [propertyType: string]: number;
// }
// export interface ElementResults {
//   [propertyType: string]: any;
// }

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

// interface SquareConfig {
//   color?: string;
//   width?: number;
//   [propName: string]: any;
// }

