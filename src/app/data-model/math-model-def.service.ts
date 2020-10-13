import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDefService {

  constructor() {

    this.constraintDefs.push(   
      
      { constraintType:'nodeBal', elementType:'bus', 
        varType:'', inEquality:'eq', rhsProperty:'', rhsValue:0, factorProperty:'' },
      { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'trancheLimit', rhsValue:0, factorProperty:'' },
      { constraintType:'bidTrancheLimit', elementType:'bidTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'trancheLimit', rhsValue:0, factorProperty:'' },
      { constraintType:'powerFlow', elementType:'branch', 
        varType:'', inEquality:'eq', rhsProperty:'', rhsValue:0, factorProperty:'' },
      { constraintType:'dirBranchLimit', elementType:'branch', 
        varType:'', inEquality:'le', rhsProperty:'flowMax', rhsValue:0, factorProperty:'' },
      { constraintType:'objective', elementType:'mathModel', 
        varType:'objectiveVal', inEquality:'eq', rhsProperty:'', rhsValue:0, factorProperty:'' }     

    )

    this.constraintComps.push( 
        
      { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', 
        varType: 'trancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', 
        varType: 'trancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', 
        varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'direction' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', 
        varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', 
        varType: 'phaseAngle', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', 
        varType: 'phaseAngle', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', 
        varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', 
        varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', 
        varType: 'trancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', 
        varType: 'trancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' }   
        
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
  factorProperty: string;
}


export interface ConstraintComp {
  constraintType: string;
  elementType: string;
  propertyMap: string;
  varType: string;
  factorParentProperty: string;
  factorValue: number;
  factorProperty: string;
}

export interface ModelVariable {
  varId: string,
  varType: string,
  elementId: string,
  quantity: number
}

export interface ModelConstraint {
  constraintId: string,
  constraintType: string,
  elementId: string,
  inequality: string,
  rhsValue: number,
  shadowPrice: number
}

export interface ModelResults {
  variables: ModelVariable[],
  constraints: ModelConstraint[]
}
