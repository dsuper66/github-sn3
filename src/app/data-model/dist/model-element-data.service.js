"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModelElementDataService = void 0;
var core_1 = require("@angular/core");
var ModelElementDataService = /** @class */ (function () {
    function ModelElementDataService(modelElementDefService) {
        this.modelElementDefService = modelElementDefService;
        this.modelElements = [];
        this.elementNextIndex = new Map();
        this.resultsDP = 2;
        // getResultVal(key: string, results: {[resultType:string] : number}):number {
        //   if (results[key] === undefined) {
        //     console.log("MISSING RESULT: " + key)
        //     return -9999.0
        //   }
        //   else {
        //     return results[key];
        //   }
        // }
        this.prevObjectiveVal = 0.0;
        //The model elements (branch, bus, etc) are added by the user
        //There are also the following "singleton" elements
        //These are manually added here
        //They are child element defintions which will
        //cause child elements to be created automatically when the parent element is added
        //--------------------------------------------------
        //Child Tranches
        //--------------
        //Bid Tranches associated with load
        this.modelElements.push({
            elementId: 'bidTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Energy Tranches associated with gen
        this.modelElements.push({
            elementId: 'enOfferTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'gen' }, { 'childTypeId': 'enOfferTranche' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Reserve Tranches associated with gen
        this.modelElements.push({
            elementId: 'resOfferTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'gen' }, { 'childTypeId': 'resOfferTranche' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Flow-Loss Segments associated with branch
        this.modelElements.push({
            elementId: 'flowLossSegmentDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'branch' }, { 'childTypeId': 'flowLossSegment' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Child Unrestricted Elements
        //---------------------------
        //(2 child records... a forward direction and a reverse)
        this.modelElements.push({
            elementId: 'dirBranchDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'branch' }, { 'childTypeId': 'dirBranch' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Static components of the model
        //mathModel has the objective as a variable
        // this.modelElements.push({
        //   elementId: 'mathmodel001', elementType: 'mathModel',
        //   properties: {},
        //   includeInModel: true
        // });
        //island has risk and reserve as variables 
        //(static for now, but will be based on connectivity, created by saveConnectivityToModel)
        // this.modelElements.push({
        //   elementId: 'island001', elementType: 'island',
        //   properties: {},
        //   includeInModel: true
        // });
    }
    ModelElementDataService.prototype.getIdForNewElementOfType = function (elementType) {
        //Get next index for i.d.
        if (this.elementNextIndex[elementType] == undefined) {
            this.elementNextIndex[elementType] = 1;
        }
        var elementIndex = this.elementNextIndex[elementType];
        //Make the i.d.
        var newId = this.makeIdFromStringAndNumber(elementType, elementIndex);
        this.elementNextIndex[elementType] = elementIndex + 1;
        console.log("New Id:" + newId);
        return newId;
    };
    ModelElementDataService.prototype.makeIdFromStringAndNumber = function (idString, idNumber) {
        return idString + ("000" + idNumber).slice(-3);
    };
    //Make Dictionary from array of objects
    //https://stackoverflow.com/questions/43147696/unable-to-extract-object-values-in-typescript
    ModelElementDataService.prototype.makeDict = function (arrayOfMaps) {
        var dict = {};
        arrayOfMaps.forEach(function (obj) {
            Object.getOwnPropertyNames(obj).forEach(function (key) {
                var value = obj[key];
                //console.log(key + '>>>>' + value);
                dict[key] = value;
            });
        });
        return dict;
    };
    //==========
    //   DATA
    //==========
    //Add element
    ModelElementDataService.prototype.addElement = function (elementId, elementType, properties) {
        this.modelElements.push({
            elementId: elementId,
            elementType: elementType,
            properties: properties,
            includeInModel: true
        });
    };
    //Delete element
    ModelElementDataService.prototype.deleteElement = function (elementId) {
        this.modelElements = this.modelElements.filter(function (e) { return e.elementId != elementId && e.properties['parentId'] != elementId; });
    };
    //Get child elements
    ModelElementDataService.prototype.getChildElementDefs = function (elementType) {
        return this.modelElements.filter(function (e) { return e.properties['parentType'] === elementType; });
    };
    ModelElementDataService.prototype.getChildElements = function (elementId) {
        return this.modelElements.filter(function (e) { return e.properties['parentId'] === elementId; });
    };
    //Test - get all properties of all
    ModelElementDataService.prototype.listAllElements = function (elementId) {
        for (var _i = 0, _a = this.modelElements; _i < _a.length; _i++) {
            var element = _a[_i];
            var propertyTypeIds = this.modelElementDefService.getPropertyTypesFor(element.elementType);
            for (var _b = 0, propertyTypeIds_1 = propertyTypeIds; _b < propertyTypeIds_1.length; _b++) {
                var propertyType = propertyTypeIds_1[_b];
                console.log("##>>" + element.elementId + " : " + propertyType + " : " + element.properties[propertyType]);
            }
        }
        return this.modelElements.filter(function (element) { return element.properties['parentId'] === elementId; });
    };
    ModelElementDataService.prototype.getModelElements = function () {
        return this.modelElements;
    };
    ModelElementDataService.prototype.getModelElementForId = function (elementId) {
        return this.modelElements.filter(function (e) { return e.elementId === elementId; })[0];
    };
    ModelElementDataService.prototype.getModelElementOfType = function (elementType) {
        return this.modelElements.filter(function (e) { return e.elementType === elementType; });
    };
    ModelElementDataService.prototype.getValueForElementProperty = function (elementId, propertyType) {
        var properties = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties;
        return properties[propertyType];
    };
    //Sum the child element properties, e.g., sum the bid quantities
    ModelElementDataService.prototype.sumForChildren = function (elementId, childElementType, childPropertyType) {
        var childElements = this.modelElements.filter(function (e) {
            return e.properties['parentId'] == elementId
                && e.elementType == childElementType;
        });
        var sum = 0.0;
        for (var _i = 0, childElements_1 = childElements; _i < childElements_1.length; _i++) {
            var e = childElements_1[_i];
            var value = e.properties[childPropertyType];
            if (value) {
                sum += value;
            }
        }
        return sum;
    };
    ModelElementDataService.prototype.getElementsWherePropertyValue = function (propertyType, value) {
        return this.modelElements.filter(function (element) { return element.properties[propertyType] === value; });
    };
    ModelElementDataService.prototype.setPropertyForElement = function (elementId, propertyType, value) {
        var _this = this;
        //Special Case
        //isRefBus... can only have one refBus so set all to false first if the new value is true
        if (propertyType === 'isRefBus' && value === 'true') {
            this.setPropertyForAllElements(propertyType, "false");
        }
        //Special Case
        //resistance... use this to populate the flow loss segments
        if (propertyType === 'resistance') {
            //Get segments and flowMax for this branch
            var segments = this.getChildElements(elementId).filter(function (e) { return e.elementType == 'flowLossSegment'; });
            var flowMax = this.getValueForElementProperty(elementId, 'flowMax');
            var segFlowLimit = Number(flowMax) / segments.length;
            for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
                var segment = segments_1[_i];
                this.setPropertyForElement(segment.elementId, 'segFlowLimit', segFlowLimit);
            }
        }
        //Update the property for the element
        var elementToUpdate = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
        //Update if found
        if (elementToUpdate) {
            elementToUpdate.properties[propertyType] = value;
            console.log("Set property:" + propertyType + " for:" + elementId + " as:" + value);
            //If child elements have the same property then it also gets updated
            //(i.e. fromBus and toBus for dirBranch)
            for (var _a = 0, _b = this.getChildElements(elementId).filter(function (childElement) { return _this.modelElementDefService.elementHasProperty(childElement, propertyType); }); _a < _b.length; _a++) {
                var childElementWithProperty = _b[_a];
                this.setPropertyForElement(childElementWithProperty.elementId, propertyType, value);
            }
        }
    };
    ModelElementDataService.prototype.setPropertyForAllElements = function (propertyType, value) {
        console.log("setPropertyForAllElements");
        if (value) {
            var elementsToUpdate = this.modelElements.filter(function (element) { return element.properties[propertyType]; });
            for (var _i = 0, elementsToUpdate_1 = elementsToUpdate; _i < elementsToUpdate_1.length; _i++) {
                var elementToUpdate = elementsToUpdate_1[_i];
                console.log("update property:" + propertyType + " of:" + elementToUpdate.elementType + " to:" + value);
                elementToUpdate.properties[propertyType] = value;
            }
        }
        else {
            console.log("NO VALUE");
        }
    };
    //=============
    //   RESULTS
    //=============
    //All values (prices and quantities) are stored in the results array of the element
    //indexed by a string which is either the name of the constraint or variable
    ModelElementDataService.prototype.resetResults = function () {
        for (var _i = 0, _a = this.modelElements; _i < _a.length; _i++) {
            var e = _a[_i];
            // for (const price in element.prices) element.prices[price] = 0
            // for (const quantity in element.quantities) element.quantities[quantity] = 0
            e.results = {};
            // for (const result in e.results) e.results[result] = 0
            e.constraintString = "";
            e.resultString = "";
        }
    };
    //Extract results from dictionary and format as string
    //For exceptions, e.g., risk deficit or uncleared load, only want to show if non-zero
    ModelElementDataService.prototype.getResultString = function (key, results, prefix, showZero) {
        if (prefix === void 0) { prefix = ""; }
        if (showZero === void 0) { showZero = true; }
        var value = results[key];
        if (value === undefined) {
            console.log("MISSING RESULT: " + key);
            return key;
        }
        else {
            if (showZero || value != 0) {
                return prefix + value.toFixed(this.resultsDP).toString();
            }
            else {
                return "";
            }
        }
    };
    //Result string for display... for the element get pre-determined result types
    //(where a result type is either a constraintType or varType) as an array of strings
    ModelElementDataService.prototype.getTextFromElementResults = function (elementId) {
        var resultString1 = "";
        var resultString2 = "";
        var resultString3 = "";
        var resultString4 = "";
        var element = this.modelElements.find(function (element) { return element.elementId === elementId; });
        if (element) {
            var results = element.results;
            if (results) {
                if (element.elementType == "bus") {
                    resultString1 = "$" + this.getResultString('nodeBal', results); //results['nodeBal'].toFixed(2).toString();  
                    resultString2 = "∠" + this.getResultString('phaseAnglePos', results);
                }
                else if (element.elementType == "gen") {
                    resultString1 = this.getResultString('enTrancheCleared', results);
                    resultString2 = "res:" + this.getResultString('resTrancheCleared', results);
                    resultString3 = this.getResultString('genResShortfall', results, "-risk:", false);
                }
                else if (element.elementType == "load") {
                    resultString1 = this.getResultString('bidTrancheCleared', results);
                    //Calc uncleared
                    var bidsCleared = results['bidTrancheCleared'];
                    if (bidsCleared) {
                        var uncleared = this.sumForChildren(elementId, 'bidTranche', 'trancheLimit') - bidsCleared;
                        //Only display if uncleared is > 0
                        if (uncleared > 0) {
                            resultString2 = "(" + uncleared.toFixed(this.resultsDP).toString() + ")";
                        }
                    }
                }
                else if (element.elementType == "island") {
                    resultString1 = "res$:" + this.getResultString('resCover', results);
                    resultString2 = "risk:" + this.getResultString('islandRisk', results);
                    resultString3 = "res:" + this.getResultString('islandRes', results);
                    resultString4 = this.getResultString('islandResShortfall', results, "-risk:", false);
                }
                else if (element.elementType == "mathModel") {
                    var objectiveVal = results['objectiveVal']; //this.getResultVal('objectiveVal',results);
                    if (objectiveVal) {
                        var deltaObjectiveVal = objectiveVal - this.prevObjectiveVal;
                        this.prevObjectiveVal = objectiveVal;
                        resultString1 = "objVal:" + this.getResultString('objectiveVal', results);
                        resultString2 = "prev:" + objectiveVal.toFixed(this.resultsDP).toString();
                        resultString3 = "delta:" + deltaObjectiveVal.toFixed(this.resultsDP).toString();
                    }
                }
                else if (element.elementType == "branch") {
                    resultString1 = this.getResultString('branchFlow', results);
                    //Determine direction of flow arrow
                    var branchFlow = results['branchFlow']; //this.getResultVal('branchFlow',results);
                    if (branchFlow) {
                        if (branchFlow > 0) {
                            resultString2 = '1';
                        }
                        else if (branchFlow < 0) {
                            resultString2 = '2';
                        }
                        else {
                            resultString2 = '0';
                        }
                    }
                }
            }
        }
        // }
        console.log("got result:>>" + resultString2 + "<<");
        return [resultString1, resultString2, resultString3, resultString4];
    };
    //The results are the shadow price of every constraint and the value of every variable
    //...to get the result we just need the constraintType or varType string
    ModelElementDataService.prototype.addResult = function (elementId, resultType, resultId, value, constraintString, resultString) {
        console.log("Element:" + elementId + " add result:" + value + " for result type:>>" + resultType + "<<");
        //Get the element
        var elementToUpdate = this.modelElements.find(function (element) { return element.elementId === elementId; });
        if (elementToUpdate) {
            //Add the arrays if they does not exist
            // if (!elementToUpdate.results) {
            //   elementToUpdate.results = {}        
            // }
            // if (!elementToUpdate.constraintString) {
            //   elementToUpdate.constraintString = ""        
            // }
            // if (!elementToUpdate.resultString) {
            //   elementToUpdate.resultString = ""        
            // }             
            //Special case
            //Node balance LTE constraint shadow price is negative
            if (resultType == "nodeBal" && resultId.includes("LTE")) {
                value *= -1.0;
            }
            //Directional results
            var direction = this.getValueForElementProperty(elementId, 'direction');
            if (direction) {
                value *= Number(direction);
            }
            //The value adds to any existing value with the same key
            //(e.g. cleared offers add up at the parent level)
            if (elementToUpdate.results) {
                if (elementToUpdate.results[resultType]) {
                    elementToUpdate.results[resultType] = elementToUpdate.results[resultType] + value;
                }
                else {
                    elementToUpdate.results[resultType] = value;
                }
            }
            //ConstraintString is empty for var result
            if (constraintString != "") {
                elementToUpdate.constraintString += "\n\n" + constraintString;
            }
            elementToUpdate.resultString += "\n" + resultString;
            //If element has a parent then also add the result to the parent
            var parentId = elementToUpdate.properties["parentId"];
            if (parentId) {
                this.addResult(parentId, resultType, resultId, value, constraintString, resultString);
            }
        }
    };
    ModelElementDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ModelElementDataService);
    return ModelElementDataService;
}());
exports.ModelElementDataService = ModelElementDataService;
