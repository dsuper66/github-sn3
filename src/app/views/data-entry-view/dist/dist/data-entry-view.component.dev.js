"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.DataEntryViewComponent = void 0;

var core_1 = require("@angular/core");

var forms_1 = require("@angular/forms");

var DataEntryViewComponent =
/** @class */
function () {
  function DataEntryViewComponent(modelElementService, router, shapeService) {
    this.modelElementService = modelElementService;
    this.router = router;
    this.shapeService = shapeService; // myGroup = new FormGroup({
    //   firstName: new FormControl()
    // });
    // propertiesFormArray = new FormArray([]);

    this.propertiesFormArray = [];
    this.formTitles = [];
    this.formDefaults = [];
    this.elementId = "none selected";
  }

  DataEntryViewComponent.prototype.ngOnInit = function () {
    this.getElementId();
  };

  DataEntryViewComponent.prototype.onSubmit = function (form) {
    console.log('you submitted value:', form);

    for (var _i = 0, _a = this.propertyTypeIds.filter(function (id) {
      return Object(form)[id] != "";
    }); _i < _a.length; _i++) {
      var propertyTypeId = _a[_i];
      var newValue = Object(form)[propertyTypeId];
      console.log(">>>" + propertyTypeId + ":" + newValue);
      this.modelElementService.setValueForElementProperty(this.elementId, propertyTypeId, newValue);
    } //Submit also navigates back


    this.router.navigate(['/network-builder-component']); // console.log('resistance:' , document.getElementById("resistance")[0].value)
    // console.log('resistance:' , form["resistance"]);
    // let items = form as {[property: string]: any};
    // for (let formItem of Object.values(form.controls) as {key:string,value:any}) {
    //   console.log("value:" + formItem.value)
    // form.forEach(element => {
    //   console.log(element)
    // }); 
    // for (const name in form.controls) {
    //     console.log ("ppp");
    // }
  };

  DataEntryViewComponent.prototype.getElementId = function () {
    //Get the element i.d. from the route
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // const elementId = this.route.snapshot.paramMap.get('elementId');
    // console.log(">>>Element ID:" + elementId 
    //   + " name:" + this.modelElementService.getElementName(elementId));
    // this.modelData.setValue(elementId);
    this.selectedShape = this.shapeService.getSelectedShape();

    if (this.selectedShape) {
      this.elementId = this.selectedShape.elementId;
      console.log(">>> " + this.selectedShape.elementTypeId);
      this.propertyTypeIds = this.modelElementService.getPropertyTypeIdsOfElementType(this.selectedShape.elementTypeId);
      console.log(this.propertyTypeIds); // interface Dict {
      //   [key: string]: string;
      // }
      // let controlsConfig: Dict;
      // var indexedArray: { [key: string]: any; } = {
      //   'connId1': ['none'],
      //   'connId2': ['none'],
      //   'resistance': ['none']
      // }
      // indexedArray = {'connId1': ['none'],connId2':['none'],'resistance':['none']};
      // var controlsConfig: {
      //   [key: string]: any;}

      for (var _i = 0, _a = this.propertyTypeIds; _i < _a.length; _i++) {
        var propertyId = _a[_i];
        this.formTitles.push(propertyId);
        var value = this.modelElementService.getValueForElementProperty(this.elementId, propertyId);
        this.formDefaults.push(value);
        console.log("current value:" + value);
        this.propertiesFormArray.push(new forms_1.FormControl(value));
      } // console.log(">>>mm>>>" + indexedArray);
      //   this.myGroup = this.fb.group({
      //     'connId1': ['none'],
      //     'connId2':['none'],
      //     'resistance':['none'] });
      // }
      // this.myGroup = this.fb.group({
      //   indexedArray });
      // }
      // this.modelData.setValue(this.elementId);

    }
  };

  DataEntryViewComponent = __decorate([core_1.Component({
    selector: 'app-data-entry-view',
    templateUrl: './data-entry-view.component.html',
    styleUrls: ['./data-entry-view.component.css']
  })], DataEntryViewComponent);
  return DataEntryViewComponent;
}();

exports.DataEntryViewComponent = DataEntryViewComponent;