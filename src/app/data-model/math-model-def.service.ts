import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDefService {

  constructor() {

    this.constraintDefs.push(   
      
    // { constraintType:'nodeBal', elementType:'bus', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    // { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', varType:'enTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    // { constraintType:'bidTrancheLimit', elementType:'bidTranche', varType:'bidTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    // { constraintType:'powerFlow', elementType:'branch', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    // { constraintType:'dirBranchLimit', elementType:'branch', varType:'', inEquality:'le', rhsValue:0, rhsProperty:'flowMax', factorValue:1, factorProperty:'' },
    // { constraintType:'objective', elementType:'mathModel', varType:'objectiveVal', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    // { constraintType:'resOffertTrancheLimit', elementType:'resOfferTranche', varType:'resTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    // { constraintType:'genRiskCalc', elementType:'gen', varType:'genRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
    // { constraintType:'islandFindRisk', elementType:'gen', varType:'genRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    // { constraintType:'islandResCalc', elementType:'island', varType:'islandRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
    // { constraintType:'resCover', elementType:'island', varType:'islandRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },

    { constraintType:'nodeBal', elementType:'bus', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', varType:'enTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    { constraintType:'bidTrancheLimit', elementType:'bidTranche', varType:'bidTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    { constraintType:'powerFlow', elementType:'branch', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'dirBranchLimit', elementType:'branch', varType:'', inEquality:'le', rhsValue:0, rhsProperty:'flowMax', factorValue:1, factorProperty:'' },
    { constraintType:'objective', elementType:'mathModel', varType:'objectiveVal', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'resOffertTrancheLimit', elementType:'resOfferTranche', varType:'resTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    { constraintType:'genRiskCalc', elementType:'gen', varType:'genRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
    { constraintType:'islandFindRisk', elementType:'gen', varType:'genRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'islandResCalc', elementType:'island', varType:'islandRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'resCover', elementType:'island', varType:'islandRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },

    )

    this.constraintComps.push( 
    
      // { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      // { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'direction' },
      // { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      // { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' },
      // { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' },
      // { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      // { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      // { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' },
      // { constraintType: 'objective', elementType: 'resOfferTranche', propertyMap: 'all', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      // { constraintType: 'genRiskCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'genRiskCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      // { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'resShortfall', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      
      { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'direction' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'resOfferTranche', propertyMap: 'all', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'resShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'resShortfallPrice' },
      { constraintType: 'genRiskCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'genRiskCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'resShortfall', factorParentProperty: '', factorValue: -1, factorProperty: 'resShortfallPrice' },

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
  rhsValue: number;  
  rhsProperty: string;
  factorValue: number;
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
