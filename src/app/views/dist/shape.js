"use strict";
exports.__esModule = true;
exports.Shape = void 0;
var Shape = /** @class */ (function () {
    function Shape() {
        //Whether the adjustment is a resize (as opposed to a move)
        //Always false for gen and load
        this.doResize = false;
        this.connId1 = "";
        this.connId2 = "";
        this.text1 = "";
        this.text2 = "";
        this.text3 = "";
        this.text4 = "";
    }
    return Shape;
}());
exports.Shape = Shape;
