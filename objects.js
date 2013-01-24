function makeIntoGameObject(obj) {
    obj.x = 0;
    obj.y = 0;
    obj.width = 0;
    obj.height = 0;
}

function Player() {
    makeIntoGameObject(this);
    this.width = 10;
    this.height = 10;
    
    this.speed = 0;
    this.acceleration = 0;
    
    this.draw = function(camera) {
        var bounds = camera.getObjectBoundsOnScreen(this);
        if(bounds === null)
            return;
        
        var ctx = camera.ctx;
        ctx.fillStyle = "orange";
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    };
    
    this.update = function() {
        this.x += this.speed;
        this.speed += this.acceleration;
        this.acceleration *= .95;
        
        //arbitrary testing stuff
        if(this.x > 400)
            this.x = 0;
    };
}
