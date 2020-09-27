import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDefService {

  constructor() {

    //Constraint Defs
    this.constraintDefs.push(
      { constraintId:'nodeBal', elementType:'bus', 
        varType:'', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'' },      
      { constraintId:'enOfferTrancheLimit', elementType:'enOfferTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'trancheLimit', rhsValue:0, multProperty:'' },
      { constraintId:'enOfferTrancheSum', elementType:'gen', 
        varType:'genCleared', inEquality:'le', rhsProperty:'', rhsValue:0, multProperty:'' },
      { constraintId:'bidTrancheLimit', elementType:'bidTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'trancheLimit', rhsValue:0, multProperty:'' },
      { constraintId:'bidTrancheSum', elementType:'load', 
        varType:'loadCleared', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'' },
      { constraintId:'powerFlow', elementType:'dirBranch', 
        varType:'branchFlow', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'direction' },
      { constraintId:'dirBranchLimit', elementType:'branch', 
        varType:'', inEquality:'le', rhsProperty:'flowMax', rhsValue:0, multProperty:'' },
      { constraintId:'riskCalc', elementType:'pwrSystem', 
        varType:'genRisk', inEquality:'le', rhsProperty:'', rhsValue:0, multProperty:'' },
      { constraintId:'objective', elementType:'mathModel', 
        varType:'objectiveVal', inEquality:'eq', rhsProperty:'', rhsValue:0, multProperty:'' },      

    )

    //Constraint Components
    this.constraintComps.push(
      { constraintId: 'nodeBal', elementType: 'gen', propertyMap: 'toBus', 
        varType: 'genCleared', multParentProperty: '', multValue: 1, multProperty: '' },
      { constraintId: 'nodeBal', elementType: 'load', propertyMap: 'fromBus', 
        varType: 'loadCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: -1, multProperty: 'direction' },
      { constraintId: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: 'direction' },
      { constraintId: 'enOfferTrancheSum', elementType: 'enOfferTranche', propertyMap: 'parentId', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'bidTrancheSum', elementType: 'bidTranche', propertyMap: 'parentId', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1, multProperty: '' },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1, multProperty: '' },
      { constraintId: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: '' },
      { constraintId: 'riskCalc', elementType: 'gen', propertyMap: 'pwrSystem', 
        varType: 'genCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'riskCalc', elementType: 'gen', propertyMap: 'pwrSystem', 
        varType: 'resCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', 
        varType: 'trancheCleared', multParentProperty: '', multValue: 1, multProperty: 'tranchePrice' },
      { constraintId: 'objective', elementType: 'bidTranche', propertyMap: 'all', 
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
  constraintId: string;
  elementType: string;
  varType: string;
  inEquality: string;
  rhsProperty: string;
  rhsValue: number;
  multProperty: string;
}


export interface ConstraintComp {
  constraintId: string;
  elementType: string;
  propertyMap: string;
  varType: string;
  multParentProperty: string;
  multValue: number;
  multProperty: string;
}
