function makeIntoGameObject(obj) {
    obj.x = 0;
    obj.y = 0;
    obj.width = 0;
    obj.height = 0;
}

function Player = function() {
    makeIntoGameObject(this);
    this.width = 10;
    this.height = 10;
    
    this.speed = 1;
    this.acceleration = 1;
    
    this.draw = function(camera) {
        var bounds = camera.getObjectBoundsOnScreen(this);
        if(bounds === null)
            return;
        
        var ctx = camera.ctx;
        ctx.fillStyle = "orange";
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    };
    
    this.update = function() {
        this.setX(this.x + speed);
        this.speed += this.acceleration;
        this.acceleration *= .95;
    };
}
