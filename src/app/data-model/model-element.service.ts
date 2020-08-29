import { Injectable } from '@angular/core';
import { ModelElement, ElementPropertyType} from './model-element';
import { Shape } from '../views/shape';
import {ElementType} from './model-element'
import {ElementProperties} from './model-element'

import { BehaviorSubject } from 'rxjs';


@Injectable({
  //the preferred way to create a singleton service
  providedIn: 'root'
})
export class ModelElementService {

  constructor() {
    
    //Property Types (and Defaults)
    this.elementPropertyTypes.push(
      {propertyTypeId:'isRefBus', primitiveType:'bool', defaultValue:true},
      {propertyTypeId:'connId1', primitiveType:'string', defaultValue:'none'},
      {propertyTypeId:'connId2', primitiveType:'string', defaultValue:'none'},
      {propertyTypeId:'maxFlow', primitiveType:'number', defaultValue:'100'},
      {propertyTypeId:'resistance', primitiveType:'number', defaultValue:'10'},
      {propertyTypeId:'susceptance', primitiveType:'number', defaultValue:'0.001'},
      {propertyTypeId:'childCount', primitiveType:'number', defaultValue:'3'}, 
      {propertyTypeId:'parentTypeId', primitiveType:'string', defaultValue:'none'}, 
      {propertyTypeId:'childTypeId', primitiveType:'string', defaultValue:'none'}, 
      {propertyTypeId:'parentId', primitiveType:'string', defaultValue:'none'}, 
      {propertyTypeId:'genLimit', primitiveType:'number', defaultValue:'80'},
      {propertyTypeId:'genPrice', primitiveType:'number', defaultValue:'100'},            
      {propertyTypeId:'resLimit', primitiveType:'number', defaultValue:'90'},
      {propertyTypeId:'resPrice', primitiveType:'number', defaultValue:'10'},         
      {propertyTypeId:'bidLimit', primitiveType:'number', defaultValue:'70'},
      {propertyTypeId:'bidPrice', primitiveType:'number', defaultValue:'150'},         
      {propertyTypeId:'flowLimit', primitiveType:'number', defaultValue:'25'},
      {propertyTypeId:'lossLimit', primitiveType:'number', defaultValue:'2'},
      {propertyTypeId:'maxGen', primitiveType:'number', defaultValue:'100'}
    )

    //Add static elements, accessed via the Settings display
    this.modelElements.push(
      {elementId: 'bidTrancheDef',elementTypeId: 'childSet', 
        properties: [{'parentTypeId':'load'},{'childTypeId':'bidTranche'},{'childCount':'3'}]}
    );


    //Element Types and their Property Type Ids
    this.propertyTypeIdsOfElementType['bus']=['isRefBus'];
    this.propertyTypeIdsOfElementType['branch']= ['connId1','connId2','maxFlow','susceptance'];
    this.propertyTypeIdsOfElementType['gen'] = ['connId1','maxGen'];
    this.propertyTypeIdsOfElementType['load'] = ['connId1'];

    this.propertyTypeIdsOfElementType['childSet'] = ['parentTypeId','childTypeId','childCount'];

    this.propertyTypeIdsOfElementType['bidTranch'] = ['parentId','bidLimit','bidPrice'];        
    this.propertyTypeIdsOfElementType['genTranch'] = ['parentId','genLimit','genPrice'];    
    this.propertyTypeIdsOfElementType['resTranch'] = ['parentId','resLimit','resPrice'];    
    this.propertyTypeIdsOfElementType['lossTranch'] = ['parentId','flowLimit','lossLimit'];

   }
  
  private modelElements:ModelElement[]=[];

  private elementPropertyTypes:ElementPropertyType[] = [];
  private propertyTypeIdsOfElementType: {[id:string]:string[]} = {};

  // private valueTypesOfProperties = new Map<string, string>();
  // private allProperties:String[] = [];

  private elementNextIndex = new Map<string, bigint>();

  getPropertyTypeIdsOfElementType(elementTypeId:string): string[] {
    console.log ("from: " + this.propertyTypeIdsOfElementType);
    // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
    // return elementType.propertyTypeIds;
    return this.propertyTypeIdsOfElementType[elementTypeId];
  }

  getModelElements(): ModelElement[] {
    return this.modelElements;
  }

  getModelElementForId(elementId: string) : ModelElement | undefined {
    return this.modelElements.filter(element => element.elementId === elementId)[0];
  }

  addModelElement(elementTypeId: string): string {
    //Get next index for i.d.
    if (this.elementNextIndex[elementTypeId] == undefined) {
      this.elementNextIndex[elementTypeId] = 1;
    }
    let elementIndex = this.elementNextIndex[elementTypeId];

    //Make the i.d.
    let elementId = elementTypeId +  ("000" + elementIndex).slice(-3);
    this.elementNextIndex[elementTypeId] = elementIndex + 1;

    //Add the element
    this.modelElements.push({
      elementId: elementId,
      elementTypeId: elementTypeId,
      properties: this.makePropertiesForElementType(elementTypeId)
      // bus1: "",
      // bus2: ""
    });

    //Add any child elements associated with this element type


    return elementId;
  }

  getValueForElementProperty(elementId:string, propertyTypeId: string):string {
    let properties = this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties;
    return properties[propertyTypeId];
  }

  setValueForElementProperty(elementId:string, propertyTypeId: string, value:any){
    this.modelElements.filter(
      element => element.elementId === elementId
    )[0].properties[propertyTypeId] = value;
  }

  makePropertiesForElementType(elementTypeId: string):ElementProperties {
    // let thesePropertyTypeIds = this.propertiesOfElementType.filter(
    //   elementType => elementType.elementTypeId === elementTypeId)[0].propertyTypeIds;

    console.log("makePropertiesForElementType of " + elementTypeId);
    let thesePropertyTypeIds = this.propertyTypeIdsOfElementType[elementTypeId];
    console.log("got property types: " + thesePropertyTypeIds);
    // let properties = this.elementPropertyTypes.filter(
    //   elementPropertyType => thesePropertyTypeIds.find(elementPropertyType.propertyTypeId thesePropertyTypeIds)
    // )
    var properties:ElementProperties = {};
    for (let propertyTypeId of thesePropertyTypeIds) {

      console.log("looking for property " + propertyTypeId)
      let elementProperty = this.elementPropertyTypes.filter(
        elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];
      
      //Assign default
      properties[elementProperty.propertyTypeId] = elementProperty.defaultValue;
      
      
    }
    return properties;
  }

  // getNewElementId(elementId: string) {
  //   return this.modelElements.filter(modelElement => modelElement.elementId === elementId)[0].name;
  // }

}
