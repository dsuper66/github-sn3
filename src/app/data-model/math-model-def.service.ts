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
    // { constraintType:'genEnResCalc', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
    // { constraintType:'genCapacityMax', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'capacityMax', factorValue:1, factorProperty:'' },
    // { constraintType:'islandFindRisk', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    // { constraintType:'islandResCalc', elementType:'island', varType:'islandRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    // { constraintType:'resCover', elementType:'island', varType:'islandRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },

    { constraintType:'nodeBal', elementType:'bus', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', varType:'enTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    { constraintType:'bidTrancheLimit', elementType:'bidTranche', varType:'bidTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    { constraintType:'powerFlow', elementType:'branch', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'dirBranchLimit', elementType:'branch', varType:'', inEquality:'le', rhsValue:0, rhsProperty:'flowMax', factorValue:1, factorProperty:'' },
    { constraintType:'objective', elementType:'mathModel', varType:'objectiveVal', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'resOffertTrancheLimit', elementType:'resOfferTranche', varType:'resTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
    { constraintType:'genEnResCalc', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
    { constraintType:'genCapacityMax', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'capacityMax', factorValue:1, factorProperty:'' },
    { constraintType:'islandFindRisk', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'islandResCalc', elementType:'island', varType:'islandRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'resCover', elementType:'island', varType:'islandRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'brFlowIsSumOfSegs', elementType:'dirBranch', varType:'branchFlow', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'brLossIsSumOfSegs', elementType:'dirBranch', varType:'branchLoss', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
    { constraintType:'segLossForFlow', elementType:'flowLossSegment', varType:'segmentLoss', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },

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
      // { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'islandResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'islandResShortfallPrice' },
      // { constraintType: 'objective', elementType: 'gen', propertyMap: 'all', varType: 'genResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'genResShortfallPrice' },
      // { constraintType: 'genEnResCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'genEnResCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      // { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      // { constraintType: 'islandFindRisk', elementType: 'gen', propertyMap: 'self', varType: 'genResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      // { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },

      { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchLoss', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' },
      { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
      { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'resOfferTranche', propertyMap: 'all', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
      { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'islandResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'islandResShortfallPrice' },
      { constraintType: 'objective', elementType: 'gen', propertyMap: 'all', varType: 'genResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'genResShortfallPrice' },
      { constraintType: 'genEnResCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'genEnResCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
      { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'islandFindRisk', elementType: 'gen', propertyMap: 'self', varType: 'genResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'brFlowIsSumOfSegs', elementType: 'flowLossSegment', propertyMap: 'parentId', varType: 'segmentFlow', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'brLossIsSumOfSegs', elementType: 'flowLossSegment', propertyMap: 'parentId', varType: 'segmentLoss', factorParentProperty: '', factorValue: -1, factorProperty: '' },
      { constraintType: 'segLossForFlow', elementType: 'flowLossSegment', propertyMap: 'self', varType: 'segmentFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'lossFlowRatio' },

      )

      //this.disabledFactors.push ('resOfferTranche.resTrancheCleared');
      this.disabledItems[ItemType.Constraint] = [];
      this.disabledItems[ItemType.VarFactor] = [];
      // this.disabledItems[ComponentType.VarFactor].push('resOfferTranche.resTrancheCleared');

  }

  private constraintDefs: ConstraintDef[] = [];
  private constraintComps: ConstraintComp[] = [];

  //Enable/disable varFactors in constraints
  //VarFactors are identified by elementType.varType
  // private disabledFactors: string[] = [];
  // factorIsEnabled(factorId: string) {
  //   return this.disabledFactors.filter(f => f === factorId).length == 0;
  // }
  // setFactorStatus(factorId: string, isEnabled: boolean) {
  //   if (isEnabled) { //remove from the disabledFactors array
  //     this.disabledFactors = this.disabledFactors.filter(f => f != factorId)
  //   }
  //   else if (this.factorIsEnabled(factorId)) { //add to the disabledFactors array if not already
  //     this.disabledFactors.push(factorId)
  //   }
  // }

  //Enable/Disable item, e.g., varFactor in Constraint, or a Constraint 
  //Items are enabled by default
  private disabledItems: string[][] = [];
  itemIsEnabled(itemType: ItemType, componentId: string) {
    //If zero entries found in the disabled array then this component is enabled
    if (this.disabledItems[itemType]) {
      return this.disabledItems[itemType].filter(f => f === componentId).length == 0;
    }
    else {
      return true;
    }
  }
  setItemStatus(itemType: ItemType, componentId: string, isEnabled: boolean) {
    //If isEnabled then remove from the disabled array
    if (isEnabled) { 
      this.disabledItems[itemType] = this.disabledItems[itemType].filter(f => f != componentId)
    }
    else if (this.itemIsEnabled(itemType, componentId)) { //add to the disabled array if not already
      this.disabledItems[itemType].push(componentId)
    }
  }  

  //get constraints where the constraintType is not disabled
  getActiveConstraintDefs(){
    return this.constraintDefs.filter(
      cd => !this.disabledItems[ItemType.Constraint].find(di => di === cd.constraintType));
  }
  //get constraint components that are not disabled and the constraintType is not disabled
  //VarFactors are identified by elementType.varType
  getActiveConstraintComps(){
    return this.constraintComps.filter(
      cc => 
        !this.disabledItems[ItemType.VarFactor].find(di => di === cc.elementType + "." + cc.varType)
        && !this.disabledItems[ItemType.Constraint].find(di => di === cc.constraintType));
  }  

  getConstraintDefsAll() {
    return this.constraintDefs;
  }
  getConstraintCompsAll() {
    return this.constraintComps;
  }
  getConstraintDef(constraintType: string):ConstraintDef {
    console.log("get constraint def of type:" + constraintType);
    return this.constraintDefs.filter(cc => cc.constraintType === constraintType)[0];
  }
  getConstraintComps(constraintType: string) {
    console.log("get constraint comps of type:" + constraintType);
    return this.constraintComps.filter(cc => cc.constraintType === constraintType);
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

//Enable/disable component
export enum ItemType {
  VarFactor,
  Constraint
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

//Returned by the solver...

export interface ModelVariable {
  varId: string,
  varType: string,
  elementId: string,
  //result
  quantity: number
}

export interface ModelConstraint {
  constraintId: string,
  constraintType: string,
  elementId: string,
  inequality: string,
  rhsValue: number,
  //constraint string created by solver pre-processing
  constraintString: string,
  //result
  shadowPrice: number
}

export interface ModelResults {
  variables: ModelVariable[],
  constraints: ModelConstraint[]
}
