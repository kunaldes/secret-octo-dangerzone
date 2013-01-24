function Camera = function(ctx) {
    this.ctx = ctx;
    
    this.setGamePosition = function(x, y) {
        this.gameX = x;
        this.gameY = y;
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
    
    /* obj must have properties x, y, width, and height */
    this.getObjectBoundsOnScreen = function(obj) {
        var gameBoundingBox = {x:gameX, y:gameY, width:gameViewWidth, height:gameViewHeight};
        if(!utils.doIntersect(gameBoundingBox, obj))
            return null;
        
        var horizontalScale = this.screenWidth / this.gameViewWidth;
        var verticalScale = this.screenHeight / this.gameViewHeight;
        
        var screenBB = {};
        screenBB.x = this.screenX + (obj.x - this.gameX) * horizontalScale;
        screenBB.y = this.screenY + (obj.y - this.gameY) * verticalScale;
        screenBB.width = obj.width * horizontalScale;
        screenBB.height = obj.height * verticalScale;
        
        return screenBB;
    };
    
    //set defaults:
    setGamePosition(0, 0);
    setGameViewSize(100, 100);
    setScreenPosition(0, 0);
    setScreenSize(800, 600);
}
