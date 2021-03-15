"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModelElementResultsService = void 0;
var core_1 = require("@angular/core");
var ModelElementResultsService = /** @class */ (function () {
    function ModelElementResultsService(modelElementDataService) {
        this.modelElementDataService = modelElementDataService;
        this.defaultDP = 2;
        this.prevObjectiveVal = 0.0;
    }
    //Extract results from dictionary and format as string
    //For exceptions, e.g., risk deficit or uncleared load, only want to show if non-zero
    ModelElementResultsService.prototype.getResultString = function (key, results, prefix, showZero, dp) {
        if (prefix === void 0) { prefix = ""; }
        if (showZero === void 0) { showZero = true; }
        if (dp === void 0) { dp = -1; }
        var decimalPlaces = this.defaultDP;
        if (dp >= 0) {
            decimalPlaces = dp;
        }
        var value = results[key];
        if (value === undefined) {
            console.log("MISSING RESULT: " + key);
            return " none"; //key
        }
        else {
            if (showZero || value != 0) {
                return prefix + value.toFixed(decimalPlaces).toString();
            }
            else {
                return "";
            }
        }
    };
    //Result string for display... for the element get pre-determined result types
    //(where a result type is either a constraintType or varType) as an array of strings
    ModelElementResultsService.prototype.getTextFromElementResults = function (elementId) {
        var resultString1 = "";
        var resultString2 = "";
        var resultString3 = "";
        var resultString4 = "";
        var results = this.modelElementDataService.getResultsDict(elementId);
        var elementType = this.modelElementDataService.getElementType(elementId);
        if (results) {
            if (elementType == "bus") {
                resultString1 = "$" + this.getResultString('nodeBal', results); //results['nodeBal'].toFixed(2).toString();  
                resultString2 = "∠" + this.getResultString('phaseAnglePos', results);
            }
            else if (elementType == "gen") {
                resultString1 = this.getResultString('enTrancheCleared', results);
                resultString2 = "res:" + this.getResultString('resTrancheCleared', results);
                resultString3 = this.getResultString('genResShortfall', results, "-risk:", false);
            }
            else if (elementType == "load") {
                resultString1 = this.getResultString('bidTrancheCleared', results);
                //Calc uncleared
                var bidsCleared = results['bidTrancheCleared'];
                if (bidsCleared) {
                    var uncleared = this.modelElementDataService.sumForChildren(elementId, 'bidTranche', 'trancheLimit') - bidsCleared;
                    //Only display if uncleared is > 0
                    if (uncleared > 0) {
                        resultString2 = "(" + uncleared.toFixed(this.defaultDP).toString() + ")";
                    }
                }
            }
            else if (elementType == "island") {
                resultString1 = "res$:" + this.getResultString('resCover', results);
                resultString2 = "risk:" + this.getResultString('islandRisk', results);
                resultString3 = "res:" + this.getResultString('islandRes', results);
                resultString4 = this.getResultString('islandResShortfall', results, "-risk:", false);
            }
            else if (elementType == "mathModel") {
                var objectiveVal = results['objectiveVal']; //this.getResultVal('objectiveVal',results);
                if (objectiveVal) {
                    var deltaObjectiveVal = objectiveVal - this.prevObjectiveVal;
                    this.prevObjectiveVal = objectiveVal;
                    resultString1 = "objVal:" + this.getResultString('objectiveVal', results);
                    resultString2 = "prev:" + objectiveVal.toFixed(this.defaultDP).toString();
                    resultString3 = "delta:" + deltaObjectiveVal.toFixed(this.defaultDP).toString();
                    resultString4 = "iterations:" + this.getResultString('iterationCount', results, "", true, 0);
                }
            }
            else if (elementType == "branch") {
                var branchFlowGross = results['branchFlow'];
                var branchFlowLoss = results['branchLoss'];
                //Non-Neg flow
                if (branchFlowGross >= 0) {
                    resultString1 = branchFlowGross.toFixed(this.defaultDP).toString();
                    resultString2 = (branchFlowGross - branchFlowLoss).toFixed(this.defaultDP).toString();
                }
                else {
                    resultString2 = Math.abs(branchFlowGross).toFixed(this.defaultDP).toString();
                    resultString1 = (Math.abs(branchFlowGross) + branchFlowLoss).toFixed(this.defaultDP).toString();
                }
                //Determine direction of flow arrow
                //The arrow
                if (branchFlowGross) {
                    //Pos flow
                    if (branchFlowGross > 0) {
                        resultString3 = '1';
                    }
                    //Neg flow
                    else if (branchFlowGross < 0) {
                        resultString3 = '2';
                    }
                    //No flow
                    else {
                        resultString3 = '0';
                    }
                }
                //Determine if binding
                var flowMax = this.modelElementDataService.getValueForElementProperty(elementId, 'flowMax');
                if (Math.abs(branchFlowGross) == Number(flowMax)) {
                    resultString4 = '1';
                }
                else {
                    resultString4 = '0';
                }
            }
        }
        // }
        console.log("got result:>>" + resultString2 + "<<");
        return [resultString1, resultString2, resultString3, resultString4];
    };
    ModelElementResultsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ModelElementResultsService);
    return ModelElementResultsService;
}());
exports.ModelElementResultsService = ModelElementResultsService;
