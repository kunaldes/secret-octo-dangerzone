var utils = function() {
    var exports = {};
    
    /* rect1 and rect2 must have the properties x, y, width, and height */
    exports.doIntersect = function(rect1, rect2) {
        var horizontally = rect1.x + rect1.width >= rect2.x && rect1.x <= rect2.x + rect2.width;
        var vertically = rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height;
        return horizontally && vertically;
    };
    
    return exports;
}();
