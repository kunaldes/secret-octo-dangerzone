function makeIntoGameObject(obj) {
    obj.x = 0;
    obj.y = 0;
    obj.width = 0;
    obj.height = 0;
    
    obj.isDeadly = false;
}

function Player() {
    makeIntoGameObject(this);
    this.width = 10;
    this.height = 10;
    
    this.xSpeed = 0;
    this.xAcceleration = 0.002;
    this.ySpeed = 0;
    this.yAcceleration = 0;
    
    this.speedMultiplier = 1;
    
    this.animation = 0;
    this.animations = [];
    this.animations.push(globalGraphics.trainerWalking);
    this.animations.push(globalGraphics.trainerRunning);
    this.animations.push(globalGraphics.trainerBiking);
    this.animations.push(globalGraphics.playerExploding);
    this.animationElapsedTime = 0;
    this.animationReset = 0;
    
    this.setAnimation = function (n, resetn) {
        if (resetn === undefined) {
            this.animationReset = n;
        } else {
            this.animationReset = resetn;
        }
        this.animation = n;
        this.animationElapsedTime = 0;
    }
    
    this.draw = function(ctx) {
        var currentAnimation = this.animations[this.animation];
        var animationDelay = Math.floor(FPS / currentAnimation.fps);
        var animationFrames = currentAnimation.xs.length;
        var elapsedTime = this.animationElapsedTime;
        var iter = Math.floor((elapsedTime) / animationDelay);
        var aX = 0;
        var aY = 0;
        var aWidth = this.width;
        var aHeight = this.height;
        if (this.animation === 3) {
            aWidth = this.width * 2;
            aHeight = this.height * 2;
            aX -= this.width / 2;
            aY -= this.height / 2;
        }
        ctx.drawImage(currentAnimation.file, currentAnimation.xs[iter],
                        currentAnimation.ys[iter],
                        currentAnimation.widths[iter],
                        currentAnimation.heights[iter],
                        aX, aY, aWidth, aHeight);
                        
        if (elapsedTime === (animationDelay * animationFrames - 1)) {
            this.animationElapsedTime = 0;
            this.animation = this.animationReset;
        } else {
            this.animationElapsedTime++;
        }
    };
    
    this.update = function() {
        this.x += this.xSpeed * this.speedMultiplier;
        this.xSpeed += this.xAcceleration;
        //this.xAcceleration *= .95;
        
        this.y += this.ySpeed;
        this.ySpeed += this.yAcceleration;
        this.yAcceleration *= .95;
        
        var prevWidth = this.width;
        var prevHeight = this.height;
        this.width *= 1.015;
        this.height *= 1.015;
        this.x -= (this.width - prevWidth) / 2;
        this.y -= (this.height - prevHeight) / 2;
    };
    
    this.reset = function() {
        var prevHeight = this.height;
        this.width = 10;
        this.height = 10;
        this.y += (prevHeight - this.height) / 2;
        
        this.xSpeed = 5;
    }
}

function Barrier(width, height) {
    makeIntoGameObject(this);
    this.width = width;
    this.height = height;
    this.isDeadly = true;
    
    this.draw = function(ctx) {
        fillTex(ctx, globalGraphics.barrierTexture, 0, 0,
                this.width, this.height);
    };
}

Barrier.createColumnObstacle = function(progress, x) {
    var width = 32;
    var maxGap = 180;
    var minGap = 160;
    
    var heightBeyondScreen = canvas.height / 2;
    
    //generate gap
    var randomFactor = Math.random() * .5 + .75;
    
    var gapHeight = maxGap - progress * randomFactor * (maxGap - minGap);
    var gapStartY = Math.random() * (canvas.height - gapHeight);
    
    var topBarrier = new Barrier(width, gapStartY + heightBeyondScreen);
    topBarrier.x = x;
    topBarrier.y = -heightBeyondScreen;
        
    var bottomBarrier = new Barrier(width, canvas.height - gapHeight - gapStartY + heightBeyondScreen);
    bottomBarrier.x = x;
    bottomBarrier.y = gapStartY + gapHeight;
    
    return {top:topBarrier, bottom:bottomBarrier};
}

function Pellet() {
    makeIntoGameObject(this);
    var frac_amt = 0.7;
    this.isPellet = true;
    
    this.width = 24;
    this.height = 24;
    
    this.draw = function(ctx) {
        fillTex(ctx, globalGraphics.pelletTexture, 0, 0,
                this.width, this.height);
    };
    
    this.handleCollision = function(player) {
        var pWidth = player.width;
        var pHeight = player.height;
        
        player.width *= frac_amt;
        player.height *= frac_amt;
        
        player.x -= (player.width - pWidth) / 2;
        player.y -= (player.height - pHeight) / 2;
    }
}
