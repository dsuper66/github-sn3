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
        varType:'trancheCleared', inEquality:'le', rhsProperty:'enOfferTrancheLimit', rhsValue:0, multProperty:'' },
      { constraintId:'enOfferTrancheSum', elementType:'gen', 
        varType:'genCleared', inEquality:'le', rhsProperty:'', rhsValue:0, multProperty:'' },
      { constraintId:'bidTrancheLimit', elementType:'bidTranche', 
        varType:'trancheCleared', inEquality:'le', rhsProperty:'bidTrancheLimit', rhsValue:0, multProperty:'' },
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
      { constraintId: 'nodeBal', elementType: 'gen', propertyMapToParent: 'toBus', 
        varType: 'genCleared', multParentProperty: '', multValue: 1, multProperty: '' },
      { constraintId: 'nodeBal', elementType: 'load', propertyMapToParent: 'fromBus', 
        varType: 'loadCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'nodeBal', elementType: 'dirBranch', propertyMapToParent: 'fromBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: -1, multProperty: 'direction' },
      { constraintId: 'nodeBal', elementType: 'dirBranch', propertyMapToParent: 'toBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: 'direction' },
      { constraintId: 'enOfferTrancheSum', elementType: 'enOfferTranche', propertyMapToParent: 'parentId', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'bidTrancheSum', elementType: 'bidTranche', propertyMapToParent: 'parentId', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'fromBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1, multProperty: '' },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'toBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1, multProperty: '' },
      { constraintId: 'dirBranchLimit', elementType: 'dirBranch', propertyMapToParent: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: '' },
      { constraintId: 'riskCalc', elementType: 'gen', propertyMapToParent: 'pwrSystem', 
        varType: 'genCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'riskCalc', elementType: 'gen', propertyMapToParent: 'pwrSystem', 
        varType: 'resCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'objective', elementType: 'genTranche', propertyMapToParent: 'genPrice', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' },
      { constraintId: 'objective', elementType: 'loadTranche', propertyMapToParent: 'loadPrice', 
        varType: 'trancheCleared', multParentProperty: '', multValue: 1, multProperty: '' }
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
  propertyMapToParent: string;
  varType: string;
  multParentProperty: string;
  multValue: number;
  multProperty: string;
}
