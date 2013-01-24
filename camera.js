function Camera(ctx) {
    this.ctx = ctx;
    
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
    
    /* obj must have properties x, y, width, and height */
    this.getObjectBoundsOnScreen = function(obj) {
        var gameBoundingBox = {x:this.gameX, y:this.gameY, width:this.gameViewWidth, height:this.gameViewHeight};
        if(!utils.doesIntersect(gameBoundingBox, obj))
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
    this.setGamePosition(0, 0);
    this.setGameViewSize(100, 100);
    this.setScreenPosition(0, 0);
    this.setScreenSize(800, 600);
}
