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
      {propertyTypeId:'connId1', primitiveType:'string', defaultValue:'nil'},
      {propertyTypeId:'connId2', primitiveType:'string', defaultValue:'nil'},
      {propertyTypeId:'maxFlow', primitiveType:'number', defaultValue:'100'},
      {propertyTypeId:'resistance', primitiveType:'number', defaultValue:'10'},
      {propertyTypeId:'susceptance', primitiveType:'number', defaultValue:'0.001'},
      {propertyTypeId:'parentId', primitiveType:'string', defaultValue:'nil'},
      {propertyTypeId:'genLimit', primitiveType:'number', defaultValue:'80'},
      {propertyTypeId:'genPrice', primitiveType:'number', defaultValue:'100'},  
      {propertyTypeId:'genTrancheCount', primitiveType:'number', defaultValue:'3'},            
      {propertyTypeId:'resLimit', primitiveType:'number', defaultValue:'90'},
      {propertyTypeId:'resPrice', primitiveType:'number', defaultValue:'10'},
      {propertyTypeId:'resTrancheCount', primitiveType:'number', defaultValue:'3'},         
      {propertyTypeId:'bidLimit', primitiveType:'number', defaultValue:'70'},
      {propertyTypeId:'bidPrice', primitiveType:'number', defaultValue:'150'},       
      {propertyTypeId:'bidTrancheCount', primitiveType:'number', defaultValue:'3'},         
      {propertyTypeId:'flowLimit', primitiveType:'number', defaultValue:'25'},
      {propertyTypeId:'lossLimit', primitiveType:'number', defaultValue:'2'},
      {propertyTypeId:'lossTrancheCount', primitiveType:'number', defaultValue:'3'},  
      {propertyTypeId:'maxGen', primitiveType:'number', defaultValue:'100'}
    )

    //Element Types and their Property Type Ids
    this.propertyTypeIdsOfElementType['bus']=['isRefBus'];
    this.propertyTypeIdsOfElementType['branch']=
      ['connId1','connId2','maxFlow','susceptance','lossTrancheCount'];
    this.propertyTypeIdsOfElementType['gen'] = ['connId1','maxGen','genTrancheCount','resTrancheCount'];
    this.propertyTypeIdsOfElementType['load'] = ['connId1'];
    this.propertyTypeIdsOfElementType['bidTranch'] = ['load','bidLimit','bidPrice','bidTrancheCount'];
    this.propertyTypeIdsOfElementType['genTranch'] = ['gen','genLimit','genPrice'];    
    this.propertyTypeIdsOfElementType['resTranch'] = ['gen','resLimit','resPrice'];    
    this.propertyTypeIdsOfElementType['lossTranch'] = ['branch','flowLimit','lossLimit'];

   }
  
  private modelElements:ModelElement[]=[];
  private elementNextIndex = new Map<string, bigint>();

  private elementPropertyTypes:ElementPropertyType[] = [];
  private propertyTypeIdsOfElementType: {[id:string]:string[]} = {};

  // private propertiesOfElementType : Map<string, string[]>;
  private valueTypesOfProperties = new Map<string, string>();
  // private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display

  private allProperties:String[] = [];


  getPropertyTypeIdsOfElementType(elementTypeId:string): string[] {
    console.log ("from: " + this.propertyTypeIdsOfElementType);
    // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
    // return elementType.propertyTypeIds;
    return this.propertyTypeIdsOfElementType[elementTypeId];
  }

  getModelElements(): ModelElement[] {
    return this.modelElements;
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
