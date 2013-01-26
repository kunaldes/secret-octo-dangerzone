function makeIntoGameObject(obj) {
    obj.x = 0;
    obj.y = 0;
    obj.width = 0;
    obj.height = 0;
    
    obj.isDeadly = false;
}

function Player() {
    makeIntoGameObject(this);
    this.width = 20;
    this.height = 20;
    
    this.xSpeed = 0;
    this.xAcceleration = 0;
    this.ySpeed = 0;
    this.yAcceleration = 0;
    
    this.draw = function(ctx) {
        ctx.fillStyle = "orange";
        ctx.fillRect(0, this.y, this.width, this.height);
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
    this.isDeadly = true;
    
    this.draw = function(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(0, this.y, this.width, this.height);
    };
    
    this.handleCollision = function(game) {
        player.x = 0;
    }
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

Barrier.createColumnObstacle = function(i, maxObstacles) {
    var startX = 400;
    var spaceBetween = 400;
    
    var width = 10;
    var maxGap = 100;
    var minGap = 30;
    
    var heightBeyondScreen = canvas.height / 2;
    
    //generate gap
    var progress = i / (maxObstacles - 1);
    var randomFactor = Math.random() * .5 + .75;
    
    var gapHeight = maxGap - progress * randomFactor * (maxGap - minGap);
    var gapStartY = Math.random() * (canvas.height - gapHeight);
    
    var topBarrier = new Barrier(width, gapStartY + heightBeyondScreen);
    topBarrier.x = spaceBetween * i + startX;
    topBarrier.y = -heightBeyondScreen;
        
    var bottomBarrier = new Barrier(width, canvas.height - gapHeight - gapStartY + heightBeyondScreen);
    bottomBarrier.x = spaceBetween * i + startX;
    bottomBarrier.y = gapStartY + gapHeight;
    
    return {top:topBarrier, bottom:bottomBarrier};
}

function Pellet() {
    makeIntoGameObject(this);
    var frac_amt = 0.7;
    
    this.width = 5;
    this.height = 5;
    
    this.draw = function(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, this.y, this.width, this.height);
    };
    
    this.handleCollision = function(player) {
        player.width *= frac_amt;
        player.height *= frac_amt;
    }
}
