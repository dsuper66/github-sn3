import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDefService {

  constructor() {

    this.constraintDefs.push(   
      
      { constraintType:'nodeBal', elementType:'bus', 
        varType:'', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'' },
      { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'trancheLimit', rhsValue:0, multProperty:'' },
      { constraintType:'bidTrancheLimit', elementType:'bidTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'trancheLimit', rhsValue:0, multProperty:'' },
      { constraintType:'powerFlow', elementType:'branch', 
        varType:'', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'' },
      { constraintType:'dirBranchLimit', elementType:'branch', 
        varType:'', inEquality:'le', rhsProperty:'flowMax', rhsValue:0, multProperty:'' },
      { constraintType:'objective', elementType:'mathModel', 
        varType:'objectiveVal', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'' }     

    )

    this.constraintComps.push( 
        
      { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', 
        varType: 'trancheCleared', multParentProperty: '', multValue: 1, multProperty: '' },
      { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: -1, multProperty: 'direction' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: 'direction' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1, multProperty: '' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1, multProperty: '' },
      { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: 'direction' },
      { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: '' },
      { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', 
        varType: 'trancheCleared', multParentProperty: '', multValue: 1, multProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: 'tranchePrice' }   
        
    )

  }


  private constraintDefs: ConstraintDef[] = [];
  private constraintComps: ConstraintComp[] = [];
  // private elementTypeVarTypes: { [elementTypeId: string]: string[] } = {};

  getConstraintDefs() {
    return this.constraintDefs;
  }

  getConstraintComps() {
    return this.constraintComps;
  }

}


export interface ConstraintDef {
  constraintType: string;
  elementType: string;
  varType: string;
  inEquality: string;
  rhsProperty: string;
  rhsValue: number;
  multProperty: string;
}


export interface ConstraintComp {
  constraintType: string;
  elementType: string;
  propertyMap: string;
  varType: string;
  multParentProperty: string;
  multValue: number;
  multProperty: string;
}
