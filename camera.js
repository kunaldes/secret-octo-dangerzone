function camerafy(cam) {
    
    /* Set the (x,y) of this camera within the game world's coordinates */
    cam.setGamePosition = function(x, y) {
        cam.gameX = x;
        cam.gameY = y;
    };
    
    /* Set the width/height of the camera within the game world's coordinates */
    cam.setGameViewSize = function(width, height) {
        cam.gameViewWidth = width;
        cam.gameViewHeight = height;
    };
    
    /**  
     * Centers the camera around the specified object in the game world
     * obj must have the properties x, y, width, and height
     */
    cam.centerViewOn = function(obj) {
        cam.gameX = obj.x + obj.width / 2 - cam.gameViewWidth / 2;
        cam.gameY = obj.y + obj.height / 2 - cam.gameViewHeight / 2;
    };
    
    /* Sets the (x,y) on the canvas where this camera should appear */
    cam.setScreenPosition = function(x, y) {
        cam.screenX = x;
        cam.screenY = y;
    };
    
    /* Sets the width/height on the canvas where this camera should appear */
    cam.setScreenSize = function(width, height) {
        cam.screenWidth = width;
        cam.screenHeight = height;
    };
    
    /* Sets up a clipping shape and set (0,0) to the screen coords */
    cam.baseTransformation = function(ctx) {
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(cam.screenX, cam.screenY);
        ctx.lineTo(cam.screenX + cam.screenWidth, cam.screenY);
        ctx.lineTo(cam.screenX + cam.screenWidth, cam.screenY + cam.screenHeight);
        ctx.lineTo(cam.screenX, cam.screenY + cam.screenHeight);
        ctx.closePath();
        ctx.clip();
        
        ctx.translate(cam.screenX, cam.screenY);
    };
    
    cam.restoreBaseTransformation = function(ctx) {
        ctx.restore();
    };
    
    //set defaults:
    cam.setGamePosition(0, 0);
    cam.setGameViewSize(100, 100);
    cam.setScreenPosition(0, 0);
    cam.setScreenSize(800, 600);
};


function InfiniCamera() {
    camerafy(this);
    
    this.objectTransform = function(ctx, obj) {
        ctx.save();
        
        var frac = .4;
        var w = this.screenWidth;
        
        var xScale = this.screenWidth / this.gameViewWidth;
        var objScreenX = xScale * (obj.x - this.gameX);
        var scale = Math.pow(frac, objScreenX / w);
        var xtran = w * (1 - scale);
        
        var yScale = this.screenHeight / this.gameViewHeight;
        var objScreenY = yScale * (obj.y - this.gameY);
        
        
        ctx.translate(xtran, objScreenY);
        ctx.scale(scale * xScale, yScale);
    };
    
    this.restoreObjectTransform = function(ctx) {
        ctx.restore();
    };
};

function BaseCamera() {
    camerafy(this);
    
    this.objectTransform = function(ctx, obj) {
        ctx.save();
        
        var xScale = this.screenWidth / this.gameViewWidth;
        var objScreenX = xScale * (obj.x - this.gameX);
        
        var yScale = this.screenHeight / this.gameViewHeight;
        var objScreenY = yScale * (obj.y - this.gameY);
        
        ctx.translate(objScreenX, objScreenY);
        ctx.scale(xScale, yScale);
    };
    
    this.restoreObjectTransform = function(ctx) {
        ctx.restore();
    };
}
