function makeIntoGameObject(obj) {
    obj.x = 0;
    obj.y = 0;
    obj.width = 0;
    obj.height = 0;
}

function Player() {
    makeIntoGameObject(this);
    this.width = 20;
    this.height = 20;
    
    this.xSpeed = 0;
    this.xAcceleration = 0;
    this.ySpeed = 0;
    this.yAcceleration = 0;
    
    this.draw = function(camera) {
        var bounds = camera.getObjectBoundsOnScreen(this);
        if(bounds === null)
            return;
        
        var ctx = camera.ctx;
        ctx.fillStyle = "orange";
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    };
    
    this.update = function() {
        this.x += this.xSpeed;
        this.xSpeed += this.xAcceleration;
        this.xAcceleration *= .95;
        
        this.y += this.ySpeed;
        this.ySpeed += this.yAcceleration;
        this.yAcceleration *= .95;
    };
}

function Barrier(width, height) {
    makeIntoGameObject(this);
    this.width = width;
    this.height = height;
    
    this.draw = function(camera) {
        var bounds = camera.getObjectBoundsOnScreen(this);
        if(bounds === null)
            return;
        
        var ctx = camera.ctx;
        ctx.fillStyle = "green";
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    };
    
}
