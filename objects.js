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

Barrier.generateBarriers = function() {
    var barriers = [];
    var numObstacles = 25;
    var width = 10;
    var maxGap = 160;
    var minGap = 30;
    var xStart = 400;
    var xSpread = 400;
    var gapPosition = 10;
    var heightBeyondScreen = canvas.height / 2;
    
    for(var i = 0; i < numObstacles; i++) {
        var progress = (numObstacles - i) / (numObstacles - 1);
        var gap = minGap + progress * (maxGap - minGap);
        //randomize the gap position:
        gapPosition = (gapPosition * 12453321 + 31) % canvas.height;
        if(gapPosition > canvas.height - gap)
            gapPosition = canvas.height - gap;
            
        var topBarrier = new Barrier(width, gapPosition + heightBeyondScreen);
        topBarrier.x = xSpread * i + xStart;
        topBarrier.y = -heightBeyondScreen;
        
        var bottomBarrier = new Barrier(width, canvas.height - gap - gapPosition + heightBeyondScreen);
        bottomBarrier.x = xSpread * i + xStart;
        bottomBarrier.y = gapPosition + gap;
        
        barriers.push(topBarrier);
        barriers.push(bottomBarrier);
    }
    
    return barriers;
}
