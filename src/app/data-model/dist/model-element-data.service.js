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
        //Manually Add Child element defintions which will
        //cause child elements to be created automatically with parent
        //--------------------------------------------------
        //Child Tranches
        //--------------
        //Bid Tranches associated with load
        this.modelElements.push({
            elementId: 'bidTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Energy Tranches associated with gen
        this.modelElements.push({
            elementId: 'enOfferTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'gen' }, { 'childTypeId': 'enOfferTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Reserve Tranches associated with gen
        this.modelElements.push({
            elementId: 'resOfferTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'gen' }, { 'childTypeId': 'resOfferTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Flow-Loss Tranches associated with branch
        this.modelElements.push({
            elementId: 'lossTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Child Unrestricted Elements
        //---------------------------
        this.modelElements.push({
            elementId: 'dirBranchDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'branch' }, { 'childTypeId': 'dirBranch' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Static components of the model
        //mathModel has the objective as a variable
        this.modelElements.push({
            elementId: 'mathmodel001', elementType: 'mathModel',
            properties: {},
            includeInModel: true
        });
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
    //===DATA===
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
        //Update the property for the element
        var elementToUpdate = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
        //Update if found
        if (elementToUpdate) {
            elementToUpdate.properties[propertyType] = value;
            console.log("Set property:" + propertyType + " for:" + elementId + " as:" + value);
            //If child elements have the same property then it also gets updated
            //(i.e. fromBus and toBus for dirBranch)
            for (var _i = 0, _a = this.getChildElements(elementId).filter(function (childElement) { return _this.modelElementDefService.elementHasProperty(childElement, propertyType); }); _i < _a.length; _i++) {
                var childElementWithProperty = _a[_i];
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
    ModelElementDataService.prototype.resetResults = function () {
        for (var _i = 0, _a = this.modelElements; _i < _a.length; _i++) {
            var element = _a[_i];
            for (var price in element.prices)
                element.prices[price] = 0;
            for (var quantity in element.quantities)
                element.quantities[quantity] = 0;
            for (var result in element.results)
                element.results[result] = 0;
        }
    };
    ModelElementDataService.prototype.checkGetResult = function (key, results) {
        if (results[key] === undefined) {
            console.log("MISSING RESULT: " + key);
            return "###";
        }
        else {
            return results[key].toFixed(2).toString();
        }
    };
    ModelElementDataService.prototype.getTextFromElementResults = function (elementId) {
        var resultString1 = "";
        var resultString2 = "";
        var resultString3 = "";
        var resultString4 = "";
        var element = this.modelElements.find(function (element) { return element.elementId === elementId; });
        if (element) {
            // for (const modelElement of this.modelElements){
            var results = element.results;
            if (results) {
                if (element.elementType == "bus") {
                    resultString1 = "$" + this.checkGetResult('nodeBal', results); //results['nodeBal'].toFixed(2).toString();  
                    resultString2 = "∠" + this.checkGetResult('phaseAnglePos', results);
                    // if (results['phaseAnglePos'] === undefined) {console.log("MISSING: phaseAnglePos")}
                    // else {
                    //   resultString1 = resultString1.concat(" ∠",
                    //     results['phaseAnglePos'].toFixed(2).toString())
                    // }
                }
                else if (element.elementType == "gen") {
                    resultString1 = this.checkGetResult('enTrancheCleared', results);
                    resultString2 = "R" + this.checkGetResult('resTrancheCleared', results);
                    // if (results["enTrancheCleared"] != undefined) {
                    //   resultString1 = results["enTrancheCleared"].toFixed(2).toString()
                    // }
                    // if (results["resTrancheCleared"]) {
                    //   resultString2 = results["resTrancheCleared"].toFixed(2).toString()
                    // }
                }
                else if (element.elementType == "load") {
                    resultString1 = this.checkGetResult('bidTrancheCleared', results);
                    // if (results["bidTrancheCleared"]) {
                    //   resultString1 = results["bidTrancheCleared"].toFixed(2).toString()
                    // }
                }
                else if (element.elementType == "island") {
                    resultString1 = "$" + this.checkGetResult('resCover', results);
                    resultString2 = "risk:" + this.checkGetResult('islandRisk', results);
                    resultString3 = "res:" + this.checkGetResult('islandRes', results);
                    resultString4 = "short:" + this.checkGetResult('resShortfall', results);
                    // if (results["islandRisk"]) {
                    //   resultString1 = "risk:" + results["islandRisk"].toFixed(2).toString()
                    // }
                    // if (results["islandRes"] != undefined) {
                    //   resultString2 = "res:" + results["islandRes"].toFixed(2).toString()
                    // }  
                    // if (results["resShortfall"]) {
                    //   resultString3 = "short:" + results["resShortfall"].toFixed(2).toString()
                    // }            
                }
                else if (element.elementType == "branch") {
                    resultString1 = "$" + this.checkGetResult('branchFlow', results);
                    // if (results["branchFlow"]) {
                    //   resultString1 = results["branchFlow"].toFixed(2).toString()
                    // }          
                }
            }
        }
        // }
        console.log("got result:>>" + resultString1 + "<<");
        return [resultString1, resultString2, resultString3, resultString4];
    };
    ModelElementDataService.prototype.addResult = function (elementId, resultType, resultId, value) {
        console.log("Element:" + elementId + " set result:" + value + " for result type:>>" + resultType + "<<");
        //Get the element
        var elementToUpdate = this.modelElements.find(function (element) { return element.elementId === elementId; });
        if (elementToUpdate) {
            //Add the results if necessary
            if (!elementToUpdate.results) {
                elementToUpdate.results = {};
            }
            //Node balance LTE constraint shadow price is negative
            if (resultType == "nodeBal" && resultId.includes("LTE")) {
                value *= -1.0;
            }
            //The value adds to any existing value with the same key
            if (elementToUpdate.results[resultType]) {
                elementToUpdate.results[resultType] = elementToUpdate.results[resultType] + value;
            }
            else {
                elementToUpdate.results[resultType] = value;
            }
            //If element has a parent then also add the result to the parent
            var parentId = elementToUpdate.properties["parentId"];
            if (parentId) {
                this.addResult(parentId, resultType, resultId, value);
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
