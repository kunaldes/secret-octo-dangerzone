function Camera() {
    
    this.setGamePosition = function(x, y) {
        this.gameX = x;
        this.gameY = y;
    };
    
    /* obj must have the properties x, y, width, and height */
    this.centerViewOn = function(obj) {
        this.gameX = obj.x + obj.width / 2 - this.gameViewWidth / 2;
        this.gameY = obj.y + obj.height / 2 - this.gameViewHeight / 2;
    };
    
    this.setGameViewSize = function(width, height) {
        this.gameViewWidth = width;
        this.gameViewHeight = height;
    };
    
    this.setScreenPosition = function(x, y) {
        this.screenX = x;
        this.screenY = y;
    };
    
    this.setScreenSize = function(width, height) {
        this.screenWidth = width;
        this.screenHeight = height;
    };

    this.transformContext = function(ctx) {
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(this.screenX, this.screenY);
        ctx.lineTo(this.screenX + this.screenWidth, this.screenY);
        ctx.lineTo(this.screenX + this.screenWidth, this.screenY + this.screenHeight);
        ctx.lineTo(this.screenX, this.screenY + this.screenHeight);
        ctx.closePath();
        ctx.clip();
        
        //ctx.scale(1, this.screenHeight / this.gameViewHeight);
        //ctx.rotate(-.3)
        ctx.translate(this.screenX, this.screenY);
    }
    
    this.restoreContext = function(ctx) {
        ctx.restore();
    }
    
    //set defaults:
    this.setGamePosition(0, 0);
    this.setGameViewSize(100, 100);
    this.setScreenPosition(0, 0);
    this.setScreenSize(800, 600);
}


function InfiniCamera() {
    this.transformContext = function(ctx, camera, obj) {
        ctx.save();
        
        var frac = .5;
        var w = camera.screenWidth;
        
        var cameraScale = camera.screenWidth / camera.gameViewWidth;
        var objScreenX = cameraScale * (obj.x - camera.gameX);
        
        var scale = Math.pow(frac, objScreenX / w);
        var xtran = w * (1 - scale);
        
        ctx.translate(xtran, -camera.gameY);
        ctx.scale(scale * cameraScale, camera.screenHeight/camera.gameViewHeight);
    }
    
    this.restoreContext = function(ctx) {
        ctx.restore();
    }
}