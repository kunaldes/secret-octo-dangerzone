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
    
    this.handleCollision = function(player) {
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

function Pellet() {
    makeIntoGameObject(this);
    var frac_amt = 0.7;
    
    this.width = 5;
    this.height = 5;
    
    this.draw = function(camera) {
        var bounds = camera.getObjectBoundsOnScreen(this);
        if(bounds === null)
            return;
        
        var ctx = camera.ctx;
        ctx.fillStyle = "blue";
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    };
    
    this.handleCollision = function(player) {
        player.width *= frac_amt;
        player.height *= frac_amt;
    }
}

/* Infinitely tall with a gap somewhere in the middle) */
function ColumnObstacle(width) {
    makeIntoGameObject(this);
    this.y = Number.NEGATIVE_INFINITY;
    this.width = width;
    this.height = Number.POSITIVE_INFINITY;
    
    
    this.setGap = function(gapStartY, gapSize) {
        this.gapStartY = gapStartY;
        this.gapSize = gapSize;
    };
    
    this.draw = function(camera) {
        /*
        var bounds = camera.getObjectBoundsOnScreen(this);
        if(bounds === null)
            return;
        */
        var gapBox = {x:this.x, y:this.gapStartY, width:this.width, height:this.gapSize};
        var gapBounds = camera.getObjectBoundsOnScreen(gapBox);
        var ctx = camera.ctx;
        ctx.fillStyle = "green";
        
        
        /*
        if(gapBounds === null) 
            console.log(bounds.x, camera.screenY, bounds.width, camera.screenHeight);
            ctx.fillRect(bounds.x, camera.screenY, bounds.width, camera.screenHeight);
        else {
            ctx.fillRect(gapBounds.x, camera.screenY, gapBounds.width, gapBounds.y - camera.screenY);
            var endGapY = gapBounds.y + gapBounds.height;
            var endScreenY = camera.screenY + camera.screenHeight;
            ctx.fillRect(gapBounds.x, endGapY, gapBounds.width, endScreenY - endGapY);
        } */
    };
    
    this.setGap(0, 50);
}


function ObstacleManager(game) {
    var numObstacles = 20;
    
    var shrinkFraction = .5;
    var startX = 400;
    var spaceBetween = 400;
    
    var width = 10;
    var maxGap = 100;
    var minGap = 30;
    
    this.obstaclesGenerated = 0;
    
    this.obstacles = [];

    var generateObstacle = function () {
        var obstacle = new ColumnObstacle(width);
        
        //generate gap
        var progress = this.obstaclesGenerated / (numObstacles - 1);
        var randomFactor = Math.random() * .5 + .75;
        var gapHeight = minGap + progress * randomFactor * (maxGap - minGap);
        var gapStartY = Math.random() * (game.gameHeight - gapHeight);
        obstacle.setGap(gapStartY, gapHeight);
        
        //position
        obstacle.x = startX + spaceBetween * this.obstaclesGenerated;
        
        this.obstaclesGenerated++;
        return obstacle;
    };
    
    this.update = function() {
        for(var i = 0; i < this.obstacles.length; i++) {
            var obstacle = this.obstacles[i];
            if(!game.isObjectOnScreen(obstacle)) {
                game.removeGameObj(obstacle);
                this.obstacles.splice(i, 1);
                i--;
                var newObstacle = generateObstacle();
                game.addGameObj(newObstacle);
            }
        }
    };
    
    this.init = function() {
        for(var i = 0; i < numObstacles; i++) {
            var newObstacle = generateObstacle();
            this.obstacles.push(newObstacle);
            game.addGameObj(newObstacle);
        }
    };
    this.init();
}
